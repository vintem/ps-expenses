import { Injectable } from '@angular/core';

export enum ReportItemType {
    food = 'Food',
    travel = 'Travel',
    training = 'Training',
    transport = 'Transport',
    unselected = ''
}

export type ReportItem = {
    description: string;
    amount: number;
    hasReceipt: boolean;
    type: ReportItemType;
    date: Date;
};

function validateFoodItem(item: ReportItem): string {
    if (item.amount >= 50 && !item.hasReceipt) {
        return 'A food item with a value greater than $50 must have a receipt';
    }
    return '';
}

function validateReceipt(item: ReportItem): string {
    return item.hasReceipt ? '' : 'The item must have a receipt';
}

function validateTraining(item: ReportItem): string {
    if (item.amount < 50 && !item.hasReceipt) {
        return '';
    }
}

const validateDate = (minDate: Date, maxDate: Date) => (item): string => {
    return +item.date >= +minDate && +item.date <= +maxDate ? '' : 'The date is invalid';
};

@Injectable()
export class ReportItemService {

    private maxDate: Date;
    private minDate: Date;
    private validateDate: (item: ReportItem) => string;

    constructor() {
        const today = new Date();
        this.maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        this.minDate = new Date(this.maxDate);
        this.minDate.setMonth(-3);
        this.validateDate = validateDate(this.minDate, this.maxDate);
    }

    isValid(item: ReportItem): string {
        switch (item.type) {
            case ReportItemType.food: {
                const validatedFood = validateFoodItem(item);
                if (validatedFood) {
                    return validatedFood;
                }
                return this.validateDate(item);
            }
            case ReportItemType.training:
                validateTraining(item);
            case ReportItemType.transport:
            case ReportItemType.travel: {
                const validatedReceipt = validateReceipt(item);
                if (validatedReceipt) {
                    return validatedReceipt;
                }
                return this.validateDate(item);
            }
            case ReportItemType.unselected:
            default:
                return 'The item type is not supported';
        }
    }
}
