import { Store } from './types';

export class StorageConstants {
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
        'deliveryDate'
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
