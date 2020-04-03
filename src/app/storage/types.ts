// продукт как известный вид товара
export class Product {
    name: string; // название продукта
    storagePeriod: number; // срок хранения в днях
    boxCapacity: number; // сколько пачек помещается в одной упаковке
    price: number; // цена за одну упаковку
}

// упаковка товара
export class Box {
    product: Product; // ссылка на продукт
    deliveryDate: number; // дата доставки на склад
}

// торговая точка
export class Store {
    name: string; // название магазина
    orders: Array<Order>; // текущие заказы точки
}

// заявка на наш склад
export class Order {
    items: Array<OrderItem>; // список продуктов
}

// пункт заказа
export class OrderItem {
    product: Product; // запрашиваемый товар
    numberOfPacks: number; // число заказанных пачек
}

// запрос поставщику на оптовую поставку продукта
export class Request {
    product: Product; // запрашиваемый товар
    numberOfBoxes: number; // число оптовых упаковок
    deliveryDate: number; // дата поставки на наш склад
}

// структура данных исключительно для вывода, не участвует в основной логике
export class BoxesData {
    productName: string;
    deliveryDate: number;
    validUntil: number;
    numberOfBoxes: number;
}
