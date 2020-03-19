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
