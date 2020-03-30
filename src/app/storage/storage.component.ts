import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';

import { Product, Box, Order, Store, OrderItem, Request } from './types';
import { StorageConstants } from './constants.helper';
import { TableHelper } from './table.helper';
import { SortHelper } from './sort.helper';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss']
})
export class StorageComponent implements OnInit {

  StorageConstants = StorageConstants; // необходимо, чтобы переменная стала видимой для шаблона
  TableHelper = TableHelper;
  formGr: FormGroup;

  K = 12;
  M = 3;
  N = 30;
  MIN_ORDER_POINTS = 0;
  MAX_ORDER_POINTS = 3;
  MIN_BOXES_TO_ORDER = 1;
  MAX_BOXES_TO_ORDER = 5;
  MIN_OPTIMAL_PRODUCT_BOXES = 5;
  BOXES_IN_REQUEST = 10;
  MIN_DAYS_TO_DELIVER = 1;
  MAX_DAYS_TO_DELIVER = 5;

  currentDay = 0;
  stopped = false;
  knownProducts: Array<Product>;
  storageBoxes: Array<Box> = [];
  boxesDataSource = new MatTableDataSource<Box>();
  stores: Array<Store>;
  ordersDataSource = new MatTableDataSource<OrderItem>();
  deliveries: Array<OrderItem>;
  deliveriesDataSource = new MatTableDataSource<OrderItem>();
  requests: Array<Request> = [];
  requestsDataSource = new MatTableDataSource<Request>();
  totalLosses = 0;
  totalIncome = 0;
  todayLosses: Array<string> = [];

  constructor(
    private $fb: FormBuilder,
  ) {
    this.formGr = this.createFormGroup();
  }

  ngOnInit() {
    this.ordersDataSource.data = null;
    this.deliveriesDataSource.data = null;
    this.requestsDataSource.data = null;
  }

  // случайное целое число от min до max
  randomInteger(min: number, max: number): number {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  createFormGroup(): FormGroup {
    return this.$fb.group({
      countOfProducts: ['', []],
      countOfStores: ['', []],
      countOfDays: ['', []],
    });
  }

  // начало симуляции, определение исходных данных по параметрам от пользователя
  start() {
    console.log('start');
    // инициализация продуктов, торговых точек и т.д.
    this.knownProducts = StorageConstants.productTypes.slice(0, this.K);
    for (const productType of this.knownProducts) {
      for (let i = 0; i < 10; i++) {
        this.storageBoxes.push({
          product: productType,
          deliveryDate: 1
        });
      }
    }
    this.storageBoxes.sort(SortHelper.sortByProductName);
    this.boxesDataSource.data = this.storageBoxes;
    this.stores = StorageConstants.stores.slice(0, this.M);

    this.step();
  }

  step() {
    this.currentDay += 1;
    if (this.currentDay - 1 === this.N) { // отнимаем 1, чтобы закончить, условно, в 31-ый день, если N = 30
      this.stop();
    }
    console.log('день:', this.currentDay);
    // тут идут все действия этого дня
    for (const request of this.requests) {
      if (request.deliveryDate === this.currentDay) {
        this.proceedRequest(request);
      }
    }
    this.writeOffGoods();
    this.generateOrders();
    this.deliveries = [];
    this.boxesDataSource.data.sort(SortHelper.sortByDeliveryDate); // storageBoxes???
    for (const store of this.stores) {
      if (store.orders.length !== 0 && store.orders[0].items.length !== 0) {
        for (const item of store.orders[0].items) {
          this.acceptOrderItem(item);
        }
      }
    }
    this.boxesDataSource.data.sort(SortHelper.sortByProductName);
    this.deliveriesDataSource.data = this.deliveries;
    // console.log('запланировали перевозки:', this.deliveries);
    this.makeRequests();
    // console.log('текущие заявки:', this.requests);
  }

  allSteps() {
    while (!this.stopped) {
      this.step();
    }
  }

  stop() {
    console.log('stop');
    this.stopped = true;
    // тут должны быть нужные остановки и вывод статистики
  }

  // проверка просроченных товаров, удаление их со склада c учетом материальных потерь
  writeOffGoods() {
    this.todayLosses = [];
    for (const box of this.storageBoxes) {
      if (box.deliveryDate + box.product.storagePeriod <= this.currentDay) {
        this.totalLosses += box.product.price;
        this.todayLosses.push(`Списана упаковка товара "${box.product.name}" стоимостью ${box.product.price} ₽.`);
      }
    }
    this.storageBoxes = this.storageBoxes.filter(item => item.deliveryDate + item.product.storagePeriod > this.currentDay);
    this.storageBoxes.sort(SortHelper.sortByProductName); // нужно для удобства визуальной составляющей
    this.boxesDataSource.data = this.storageBoxes; // обновление данных в таблице
  }

  // проход по торговым точкам и генерация заказов
  generateOrders() {
    this.ordersDataSource.data = [];
    const ordersData = [];
    for (const store of this.stores) {
      store.orders = []; // предыдущие заказы забываем, так как они либо исполнены, либо отклонены
      const numberOfItems = this.randomInteger(this.MIN_ORDER_POINTS, this.MAX_ORDER_POINTS);
      console.log(`от торг. точки ${store.name} закажем ${numberOfItems} продуктов:`);
      if (numberOfItems > 0) {
        const newOrder: Order = {
          items: []
        };
        const orderedProducts = [];
        for (let i = 0; i < numberOfItems; i++) { // 1 итерация = добавление одного товара в заказ
          let productIndex = this.randomInteger(0, this.K - 1);
          if (orderedProducts.indexOf(productIndex) !== -1) { // убираем повторения продуктов в заказе
            while (orderedProducts.indexOf(productIndex) !== -1) {
              productIndex = this.randomInteger(0, this.K - 1);
            }
          }
          orderedProducts.push(productIndex);
          const packsToOrder = this.randomInteger(this.MIN_BOXES_TO_ORDER * this.knownProducts[productIndex].boxCapacity,
            this.MAX_BOXES_TO_ORDER * this.knownProducts[productIndex].boxCapacity);
          newOrder.items.push({
            product: this.knownProducts[productIndex],
            numberOfPacks: packsToOrder
          });
          ordersData.push({
            product: this.knownProducts[productIndex],
            numberOfPacks: packsToOrder
          });
        }
        store.orders.push(newOrder);
        console.log('добавили заказ в торг. точку:', store);
      }
    }
    this.ordersDataSource.data = ordersData;
  }

  // обработка одного пункта заказа с учетом будущего вывоза продуктов со склада и добавлением перевозки
  acceptOrderItem(orderItem: OrderItem) {
    const numberOfBoxes = this.getOptimalNumberofBoxes(orderItem.product, orderItem.numberOfPacks);
    if (numberOfBoxes > 0) {
      this.prepareGoodsToDeliver(orderItem.product, numberOfBoxes);
      this.totalIncome += numberOfBoxes * orderItem.product.price;
      this.deliveries.push({
        product: orderItem.product,
        numberOfPacks: numberOfBoxes * orderItem.product.boxCapacity
      });
    }
  }

  // смотрит, сколько можем отправить опт. упаковок товара product, чтобы отправить пачек в кол-ве needPacks
  getOptimalNumberofBoxes(product: Product, needPacks: number): number {
    const countOfBoxes = this.boxesDataSource.data.filter(box => box.product.name === product.name).length;
    // вариант 1: свободного товара на складе не осталось
    if (countOfBoxes === 0) {
      return 0;
    }
    // вариант 2: заказано товара больше или ровно столько, сколько возможно отправить
    if (countOfBoxes * product.boxCapacity <= needPacks) {
      return countOfBoxes;
    }
    // вариант 3: заказано меньше чем есть на складе, отправляем чуть больше товара
    return Math.ceil(needPacks / product.boxCapacity);
  }

  // плинирует списание товаров со склада на доставку
  prepareGoodsToDeliver(product: Product, numberOfBoxes: number) {
    let proceedBoxes = 0;
    let i = 0;
    while (proceedBoxes < numberOfBoxes) {
      if (this.storageBoxes[i].product.name === product.name) {
        this.storageBoxes.splice(i, 1);
        proceedBoxes++;
      } else {
        i++;
      }
    }
  }

  // проверяет, нужно ли (уже с учетом запланированных перевозок) докупать продукты и при надобности делает заявки поставщику
  makeRequests() {
    this.requestsDataSource.data = [];
    const todayRequests: Array<Request> = [];
    for (const knownProduct of this.knownProducts) {
      if (this.getCountOfProduct(knownProduct) < this.MIN_OPTIMAL_PRODUCT_BOXES) {
        const newRequest = {
          product: knownProduct,
          numberOfBoxes: this.BOXES_IN_REQUEST,
          deliveryDate: this.currentDay + this.randomInteger(this.MIN_DAYS_TO_DELIVER, this.MAX_DAYS_TO_DELIVER)
        };
        this.requests.push(newRequest);
        todayRequests.push(newRequest);
      }
    }
    this.requestsDataSource.data = todayRequests;
  }

  // считает, сколько сейчас на складе есть оптовых упаковок товара product
  getCountOfProduct(product: Product): number {
    return this.storageBoxes.filter(item => item.product.name === product.name).length;
  }

  // добавляет на склад продукты по исполняемой заявке request
  proceedRequest(request: Request) {
    for (let i = 0; i < request.numberOfBoxes; i++) {
      this.boxesDataSource.data.push({
        product: request.product,
        deliveryDate: this.currentDay
      });
    }
    console.log('Исполнили заявку', request);
  }
}
