import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

function getRoleFromToken(): 'admin' | 'user' | null {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const payloadPart = token.split('.')[1]; // 1 yrepresenti payload (0:header,1:payload,2:signature)
    const payload = JSON.parse(atob(payloadPart)); //transformiw l objet js
    return payload?.role ?? null;
  } catch {
    return null;
  }
}

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);

  const role = getRoleFromToken();
  if (role !== 'admin') {
    router.navigate(['/home']);
    return false;
  }
  return true;
};
