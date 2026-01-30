import { HttpInterceptorFn } from '@angular/common/http';
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('accessToken');

  if (token) {
 
    req = req.clone({  // clone khater on ne peut pas modifier direct
      setHeaders: {
        Authorization: `Bearer ${token}`  
      }
    });
  }

  return next(req);
};
