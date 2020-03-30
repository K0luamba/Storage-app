// TODO: попытаться делать это через json
import { Product, Store } from './types';

export class StorageConstants {
    static readonly productTypes: Array<Product> = [
        {
            name: 'Хлеб',
            storagePeriod: 4,
            boxCapacity: 15,
            price: 300
        },
        {
            name: 'Сушки',
            storagePeriod: 22,
            boxCapacity: 16,
            price: 640
        },
        {
            name: 'Масло',
            storagePeriod: 20,
            boxCapacity: 20,
            price: 1000
        },
        {
            name: 'Помидоры',
            storagePeriod: 10,
            boxCapacity: 18,
            price: 900
        },
        {
            name: 'Огурцы',
            storagePeriod: 6,
            boxCapacity: 20,
            price: 800
        },
        {
            name: 'Авокадо',
            storagePeriod: 12,
            boxCapacity: 15,
            price: 1500
        },
        {
            name: 'Груша',
            storagePeriod: 21,
            boxCapacity: 20,
            price: 1000
        },
        {
            name: 'Говядина',
            storagePeriod: 6,
            boxCapacity: 10,
            price: 4000
        },
        {
            name: 'Форель',
            storagePeriod: 7,
            boxCapacity: 12,
            price: 4800
        },
        {
            name: 'Молоко',
            storagePeriod: 10,
            boxCapacity: 12,
            price: 600
        },
        {
            name: 'Торт',
            storagePeriod: 7,
            boxCapacity: 10,
            price: 3500
        },
        {
            name: 'Сметана',
            storagePeriod: 10,
            boxCapacity: 25,
            price: 1375
        },
        {
            name: 'Йогурт',
            storagePeriod: 6,
            boxCapacity: 25,
            price: 500
        },
        {
            name: 'Сырок',
            storagePeriod: 10,
            boxCapacity: 36,
            price: 432
        },
        {
            name: 'Пастила',
            storagePeriod: 20,
            boxCapacity: 18,
            price: 900
        },
        {
            name: 'Творог',
            storagePeriod: 4,
            boxCapacity: 16,
            price: 800
        },
        {
            name: 'Яйца',
            storagePeriod: 20,
            boxCapacity: 20,
            price: 1000
        },
        {
            name: 'Колбаса',
            storagePeriod: 6,
            boxCapacity: 12,
            price: 1200
        },
        {
            name: 'Руккола',
            storagePeriod: 7,
            boxCapacity: 15,
            price: 600
        },
        {
            name: 'Белый шоколад',
            storagePeriod: 25,
            boxCapacity: 25,
            price: 1250
        },
    ];

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
