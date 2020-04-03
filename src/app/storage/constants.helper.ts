import { Store } from './types';

export class StorageConstants {

    static readonly MIN_COUNT_OF_PRODUCTS = 12;
    static readonly MAX_COUNT_OF_PRODUCTS = 20;
    static readonly MIN_COUNT_OF_STORES = 3;
    static readonly MAX_COUNT_OF_STORES = 9;
    static readonly MIN_COUNT_OF_DAYS = 10;
    static readonly MAX_COUNT_OF_DAYS = 30;

    static readonly MIN_PRODUCT_BOXES = 10;
    static readonly MAX_PRODUCT_BOXES = 20;
    static readonly MIN_ORDER_POINTS = 0;
    static readonly MAX_ORDER_POINTS = 3;
    static readonly MIN_BOXES_TO_ORDER = 1;
    static readonly MAX_BOXES_TO_ORDER = 5;
    static readonly MIN_OPTIMAL_PRODUCT_BOXES = 5;
    static readonly BOXES_IN_REQUEST = 10;
    static readonly MIN_DAYS_TO_DELIVER = 1;
    static readonly MAX_DAYS_TO_DELIVER = 5;

    static readonly stores: Array<Store> = [
        {
            name: 'Billa',
            orders: [],
        },
        {
            name: 'Мираторг',
            orders: [],
        },
        {
            name: 'Konzum',
            orders: [],
        },
        {
            name: 'SPAR',
            orders: [],
        },
        {
            name: 'Вкусвилл',
            orders: [],
        },
        {
            name: 'Пятерочка',
            orders: [],
        },
        {
            name: 'Ven Comer',
            orders: [],
        },
        {
            name: 'Добрынинский',
            orders: [],
        },
        {
            name: 'Кухня у Васи',
            orders: [],
        },
    ];

    static readonly boxesDisplayedColumns = [
        'name',
        'deliveryDate',
        'validUntil',
        'numberOfBoxes'
    ];

    static readonly ordersDisplayedColumns = [
        'storeName',
        'productName',
        'numberOfPacks'
    ];

    static readonly deliveriesDisplayedColumns = [
        'productName',
        'numberOfPacks',
        'numberOfBoxes'
    ];

    static readonly requestsDisplayedColumns = [
        'productName',
        'numberOfBoxes',
        'deliveryDate'
    ];
}
