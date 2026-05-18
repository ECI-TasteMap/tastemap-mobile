import { supabase } from '../../lib/supabase';
import apiClient from '../api/apiClient';
import type { Restaurant } from '../../types/restaurant';

// ── Backend role type ────────────────────────────────────────────────────────

export type BackendRole = 'USER' | 'OWNER' | 'ADMIN';

// ── Request / Response types for backend ────────────────────────────────────

export interface BackendUserCreateRequest {
  fullname: string;
  password: string; // sent over HTTPS; never logged
  email: string;
  role: BackendRole;
}

export interface BackendUserResponse {
  id: string;
  fullname: string;
  email: string;
  role: BackendRole;
}

export interface BackendRestaurantCreateInput {
  ownerId: string;
  name: string;
  phone?: string;
  description?: string;
  theme?: string;
  locations?: string[];
  tags?: string[];
  priceMin?: number;
  priceMax?: number;
  hour?: string;
}

// ── Sign-up params (kept for useSignUp compatibility) ────────────────────────

export interface SignUpUserParams {
  email: string;
  password: string;
  fullName: string;
}

export interface SignUpOwnerParams extends SignUpUserParams {
  restaurantName: string;
  phone?: string;
  theme?: string;
  location?: string;
  description?: string;
}

// ── Return types ─────────────────────────────────────────────────────────────

export interface RegisterUserResult {
  needsVerification: boolean;
  backendUserId: string;
}

export interface RegisterOwnerResult {
  needsVerification: boolean;
  backendUserId: string;
  // null when restaurant creation failed (e.g. 401 before email verification).
  // User can create the restaurant from "Mi local" after signing in.
  restaurantId: string | null;
}

// ── Private helpers ──────────────────────────────────────────────────────────

// POST /api/v1/users — public endpoint, no auth required
async function createBackendUser(params: BackendUserCreateRequest): Promise<BackendUserResponse> {
  const { password: _omit, ...safeLog } = params;
  if (__DEV__) console.log('[authService] POST /api/v1/users payload:', safeLog);

  try {
    const response = await apiClient.post<BackendUserResponse>('/api/v1/users', {
      fullname: params.fullname,
      password: params.password, // required by backend for BCrypt; never logged
      email: params.email,
      role: params.role,
    });
    if (__DEV__) console.log('[authService] POST /api/v1/users →', response.status, response.data.id);
    return response.data;
  } catch (err) {
    const detail = err instanceof Error ? err.message : 'Error desconocido';
    console.error('[authService] POST /api/v1/users failed:', detail);
    throw new Error(`La cuenta se creó en Supabase, pero no se pudo sincronizar con el backend. ${detail}`);
  }
}

function resolveEffectiveTags(input: BackendRestaurantCreateInput): string[] {
  if (input.tags?.length) return input.tags;
  if (input.theme) return [input.theme];
  return [];
}

function buildRestaurantFormData(input: BackendRestaurantCreateInput, tags: string[]): FormData {
  const fd = new FormData();
  fd.append('ownerId', input.ownerId);
  fd.append('name', input.name);
  if (input.phone) fd.append('phone', input.phone);
  if (input.description) fd.append('description', input.description);
  if (input.theme) fd.append('theme', input.theme);
  if (input.priceMin !== undefined) fd.append('priceMin', String(input.priceMin));
  if (input.priceMax !== undefined) fd.append('priceMax', String(input.priceMax));
  if (input.hour) fd.append('hour', input.hour);
  input.locations?.forEach((loc) => fd.append('locations', loc));
  tags.forEach((tag) => fd.append('tags', tag));
  // TODO: Add logo and menu file uploads when ImagePicker is integrated.
  return fd;
}

function logRestaurantError(detail: string): void {
  const isAuthError =
    detail.includes('401') || detail.includes('Unauthorized') || detail.includes('403');
  if (isAuthError) {
    console.warn('[authService] POST /api/v1/restaurants skipped: no active session (email verification pending).');
  } else {
    console.error('[authService] POST /api/v1/restaurants failed:', detail);
  }
}

// POST /api/v1/restaurants — protected endpoint, multipart/form-data
// Returns null (non-fatal) if auth is unavailable (e.g. email verification pending).
async function createBackendRestaurant(input: BackendRestaurantCreateInput): Promise<Restaurant | null> {
  // Use theme as initial tag when no explicit tags are provided.
  // TODO: Add a dedicated tags input to RestaurantRegisterScreen.
  const effectiveTags = resolveEffectiveTags(input);
  const formData = buildRestaurantFormData(input, effectiveTags);

  if (__DEV__) {
    console.log('[authService] POST /api/v1/restaurants FormData fields:', {
      ownerId: input.ownerId, name: input.name, phone: input.phone,
      description: input.description, theme: input.theme,
      locations: input.locations, tags: effectiveTags,
      priceMin: input.priceMin, priceMax: input.priceMax, hour: input.hour,
    });
  }

  try {
    // Content-Type 'multipart/form-data' signals multipart to React Native's XHR,
    // which appends the boundary automatically. Do not set it to 'application/json'.
    const response = await apiClient.post<Restaurant>('/api/v1/restaurants', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (__DEV__) console.log('[authService] POST /api/v1/restaurants →', response.status, response.data.id);
    return response.data;
  } catch (err) {
    logRestaurantError(err instanceof Error ? err.message : 'Error desconocido');
    // Non-fatal: user + Supabase account were created. Restaurant can be created later from "Mi local".
    return null;
  }
}

// ── Public registration functions ────────────────────────────────────────────

export async function signUpUser({
  email,
  password,
  fullName,
}: SignUpUserParams): Promise<RegisterUserResult> {
  // Step 1: Create Supabase account
  const { data, error: supabaseError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { fullname: fullName, role: 'USER' } },
  });
  if (supabaseError) {
    throw new Error(`No se pudo crear la cuenta: ${supabaseError.message}`);
  }

  // Step 2: Create user in backend with role USER (public endpoint — works without session)
  const backendUser = await createBackendUser({ fullname: fullName, password, email, role: 'USER' });

  return {
    needsVerification: data.session === null,
    backendUserId: backendUser.id,
  };
}

export async function signUpOwner({
  email,
  password,
  fullName,
  restaurantName,
  phone,
  theme,
  location,
  description,
}: SignUpOwnerParams): Promise<RegisterOwnerResult> {
  // Step 1: Create Supabase account
  const { data, error: supabaseError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullname: fullName,
        role: 'OWNER',
        restaurantName,
        phone: phone ?? '',
        theme: theme ?? '',
        location: location ?? '',
        description: description ?? '',
      },
    },
  });
  if (supabaseError) {
    throw new Error(`No se pudo crear la cuenta: ${supabaseError.message}`);
  }

  // Step 2: Create OWNER user in backend (public endpoint — works without session)
  const backendUser = await createBackendUser({ fullname: fullName, password, email, role: 'OWNER' });

  // Step 3: Create restaurant (protected endpoint — may return null if session not active yet)
  const restaurant = await createBackendRestaurant({
    ownerId: backendUser.id,
    name: restaurantName,
    phone: phone || undefined,
    description: description || undefined,
    theme: theme || undefined,
    locations: location ? [location] : undefined,
    // TODO: Add explicit tags input to RestaurantRegisterScreen; using theme as fallback for now.
  });

  return {
    needsVerification: data.session === null,
    backendUserId: backendUser.id,
    restaurantId: restaurant?.id ?? null,
  };
}

export async function resendVerificationCode(email: string) {
  return supabase.auth.resend({ type: 'signup', email });
}
