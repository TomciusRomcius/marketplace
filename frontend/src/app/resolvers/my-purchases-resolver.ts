import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Purchase, PurchasesService } from '../services/purchases-service';

export const myPurchasesResolver: ResolveFn<Purchase[]> = () => {
  return inject(PurchasesService).getMyPurchases();
};
