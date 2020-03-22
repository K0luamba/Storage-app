// продукт как известный вид
export class Product {
    name: string;
    storagePeriod: number; // срок хранения в днях
    boxCapacity: number; // сколько пачек (считаем все расфасованным) помещается в одной упаковке(ящике)
    price: number; // цена за одну упаковку
}

// упаковка, со ссылкой на продукт
export class Box {
    product: Product;
    deliveryDate: number;
}

// торговая точка со списком текущих заказов от нее
export class Store {
    name: string;
    orders: Array<Order>;
}

// заявка на наш склад
export class Order {
    items: Array<OrderItem>;
}

export class OrderItem {
    product: Product;
    numberOfPacks: number; // число заказанных пачек (1 упаковка = n пачек)
}
