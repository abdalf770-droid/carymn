// Currency conversion utilities for Abu Haider Cars

// Exchange rates (approximate as of 2025)
export const EXCHANGE_RATES = {
  SAR_TO_YER: 140, // 1 Saudi Riyal = 140 Yemeni Riyal (approximate)
  YER_TO_SAR: 0.007143 // 1 Yemeni Riyal = 0.007143 Saudi Riyal
};

export function formatSAR(amount: number): string {
  return `${amount.toLocaleString('ar-SA')} ريال سعودي`;
}

export function formatYER(amount: number): string {
  return `${amount.toLocaleString('ar-YE')} ريال يمني`;
}

export function convertSARToYER(sarAmount: number): number {
  return Math.round(sarAmount * EXCHANGE_RATES.SAR_TO_YER);
}

export function convertYERToSAR(yerAmount: number): number {
  return Math.round(yerAmount * EXCHANGE_RATES.YER_TO_SAR);
}

export function formatDualCurrency(sarAmount: number): {
  sar: string;
  yer: string;
  yerAmount: number;
} {
  const yerAmount = convertSARToYER(sarAmount);
  return {
    sar: formatSAR(sarAmount),
    yer: formatYER(yerAmount),
    yerAmount
  };
}