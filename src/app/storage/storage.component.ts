import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { takeWhile } from 'rxjs/operators';

import { Product, Box, Order, Store, OrderItem, Request, BoxesData } from './types';
import { StorageConstants } from './constants.helper';
import { TableHelper } from './table.helper';
import { SortHelper } from './sort.helper';
import { Validator } from './validator';
import products from './products.json';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss']
})
// основной класс, отвечающий за взаимодействие элементов между собой
export class StorageComponent implements OnInit, OnDestroy {

  alive = true;
  StorageConstants = StorageConstants; // необходимо, чтобы переменная стала видимой для шаблона
  TableHelper = TableHelper;
  formGr: FormGroup;
  invalidForm = false;
  countOfProductsValidation = null;
  countOfStoresValidation = null;
  countOfDaysValidation = null;

  K: number; // число видов продуктов
  M: number; // число торговых точек
  N: number; // число дней симуляции

  currentDay = 0;
  stopped = false;
  knownProducts: Array<Product>;
  storageBoxes: Array<Box> = [];
  boxesData: Array<BoxesData> = [];
  stores: Array<Store>;
  ordersDataSource = new MatTableDataSource<OrderItem>();
  deliveries: Array<OrderItem>;
  deliveriesDataSource = new MatTableDataSource<OrderItem>();
  requests: Array<Request> = [];
  requestsDataSource = new MatTableDataSource<Request>();
  totalLosses = 0;
  totalIncome = 0;
  todayLosses: Array<string> = [];
  ordersCompleted = 0;
  ordersPartlyCompleted = 0;
  ordersNotCompleted = 0;

  constructor(
    private $fb: FormBuilder,
  ) {
    this.formGr = this.createFormGroup();
  }

  ngOnInit() {
    this.ordersDataSource.data = null;
    this.deliveriesDataSource.data = null;
    this.requestsDataSource.data = null;
    this.enableValidation();
  }

  ngOnDestroy() {
    this.alive = false;
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

  // проверка того, что пользователь ввел правильные значения в форму
  enableValidation() {
    this.formGr.get('countOfProducts').valueChanges
      .pipe(takeWhile(() => this.alive)).subscribe(value => {
        this.countOfProductsValidation = Validator.checkCountOfProducts(value);
        this.checkAllIsValid();
      });
    this.formGr.get('countOfStores').valueChanges
      .pipe(takeWhile(() => this.alive)).subscribe(value => {
        this.countOfStoresValidation = Validator.checkCountOfStores(value);
        this.checkAllIsValid();
      });
    this.formGr.get('countOfDays').valueChanges
      .pipe(takeWhile(() => this.alive)).subscribe(value => {
        this.countOfDaysValidation = Validator.checkCountOfDays(value);
        this.checkAllIsValid();
      });
  }

  // отвечает за блокировку/разблокировку кнопки начала
  checkAllIsValid() {
    if (this.countOfProductsValidation || this.countOfStoresValidation || this.countOfDaysValidation) {
      this.invalidForm = true;
    } else {
      this.invalidForm = false;
    }
  }

  // не выводим сообщение об ошибке по умолчанию, но инициируем проверку значений, когда надо
  triggerValidation() {
    for (const control of Object.keys(this.formGr.controls)) {
      this.formGr.get(control).setValue(this.formGr.get(control).value);
    }
  }

  // сделано для более структурированного представления данных о продуктах в таблице
  reloadBoxesData() {
    this.boxesData = [];
    for (const product of this.knownProducts) {
      for (let date = 1; date <= this.N; date++) {
        let countOfThisPair = 0;
        for (const box of this.storageBoxes) {
          if (box.product.name === product.name && box.deliveryDate === date) {
            countOfThisPair++;
          }
        }
        if (countOfThisPair > 0) {
          this.boxesData.push({
            productName: product.name,
            deliveryDate: date,
            validUntil: date + product.storagePeriod,
            numberOfBoxes: countOfThisPair
          });
        }
      }
    }
    console.log('boxes info:', this.boxesData);
  }

  // начало симуляции, определение исходных данных (продуктов, торговых точек) по параметрам от пользователя
  start() {
    console.log('start');
    this.triggerValidation();
    if (this.invalidForm) { return; }
    this.K = Number(this.formGr.get('countOfProducts').value);
    this.M = Number(this.formGr.get('countOfStores').value);
    this.N = Number(this.formGr.get('countOfDays').value);
    this.formGr.get('countOfProducts').disable();
    this.formGr.get('countOfStores').disable();
    this.formGr.get('countOfDays').disable();
    this.knownProducts = products.slice(0, this.K);
    this.knownProducts.sort(SortHelper.sortByName);
    for (const productType of this.knownProducts) {
      for (let i = 0; i < this.randomInteger(StorageConstants.MIN_PRODUCT_BOXES, StorageConstants.MAX_PRODUCT_BOXES); i++) {
        this.storageBoxes.push({
          product: productType,
          deliveryDate: 1
        });
      }
    }
    this.storageBoxes.sort(SortHelper.sortByProductName);
    this.stores = StorageConstants.stores.slice(0, this.M);

    this.step();
  }

  // проводит действия, которые поочередно должны происходить за день
  step() {
    this.currentDay += 1;
    if (this.currentDay - 1 === this.N) { // отнимаем 1, чтобы закончить, условно, в 31-ый день, если N = 30
      this.stop();
    } else {
      console.log('день:', this.currentDay);
      for (const request of this.requests) {
        if (request.deliveryDate === this.currentDay) {
          this.proceedRequest(request);
        }
      }
      this.writeOffGoods();
      this.reloadBoxesData();
      this.generateOrders();
      this.deliveries = [];
      this.storageBoxes.sort(SortHelper.sortByDeliveryDate);
      for (const store of this.stores) {
        if (store.orders.length !== 0 && store.orders[0].items.length !== 0) {
          for (const item of store.orders[0].items) {
            this.acceptOrderItem(item);
          }
        }
      }
      this.storageBoxes.sort(SortHelper.sortByProductName);
      this.deliveriesDataSource.data = this.deliveries;
      // console.log('запланировали перевозки:', this.deliveries);
      this.makeRequests();
      // console.log('текущие заявки:', this.requests);
    }
  }

  allSteps() {
    while (!this.stopped) {
      this.step();
    }
  }

  stop() {
    console.log('stop');
    this.stopped = true;
  }

  // проверка просроченных товаров, удаление их со склада c учетом материальных потерь
  writeOffGoods() {
    this.todayLosses = [];
    for (const product of this.knownProducts) {
      let numberOfExpired = 0;
      for (const box of this.storageBoxes) {
        if (box.product.name === product.name && box.deliveryDate + box.product.storagePeriod <= this.currentDay) {
          this.totalLosses += box.product.price;
          numberOfExpired++;
        }
      }
      if (numberOfExpired > 0) {
        this.todayLosses.push(`Списан товар "${product.name}" стоимостью ${product.price} ₽ в количестве ${numberOfExpired} упаковок(-ки).`);
      }
    }
    this.storageBoxes = this.storageBoxes.filter(item => item.deliveryDate + item.product.storagePeriod > this.currentDay);
    this.storageBoxes.sort(SortHelper.sortByProductName); // нужно для удобства визуальной составляющей
  }

  // проход по торговым точкам и генерация заказов
  generateOrders() {
    this.ordersDataSource.data = [];
    const ordersData = [];
    for (const store of this.stores) {
      store.orders = []; // предыдущие заказы забываем, так как они либо исполнены, либо отклонены
      const numberOfItems = this.randomInteger(StorageConstants.MIN_ORDER_POINTS, StorageConstants.MAX_ORDER_POINTS);
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
          const packsToOrder = this.randomInteger(StorageConstants.MIN_BOXES_TO_ORDER * this.knownProducts[productIndex].boxCapacity,
            StorageConstants.MAX_BOXES_TO_ORDER * this.knownProducts[productIndex].boxCapacity);
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
        console.log('добавили заказ в данную торг. точку:', store);
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
    const countOfBoxes = this.storageBoxes.filter(box => box.product.name === product.name).length;
    // вариант 1: свободного товара на складе не осталось
    if (countOfBoxes === 0) {
      this.ordersNotCompleted++;
      return 0;
    }
    // вариант 2: заказано товара больше или ровно столько, сколько возможно отправить
    if (countOfBoxes * product.boxCapacity <= needPacks) {
      this.ordersPartlyCompleted++;
      return countOfBoxes;
    }
    // вариант 3: заказано меньше чем есть на складе, отправляем чуть больше товара
    this.ordersCompleted++;
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
      if (this.getCountOfProduct(knownProduct) < StorageConstants.MIN_OPTIMAL_PRODUCT_BOXES
        && !this.haveProductInFutureRequests(knownProduct)) {
        const newRequest = {
          product: knownProduct,
          numberOfBoxes: StorageConstants.BOXES_IN_REQUEST,
          deliveryDate: this.currentDay + this.randomInteger(StorageConstants.MIN_DAYS_TO_DELIVER, StorageConstants.MAX_DAYS_TO_DELIVER)
        };
        this.requests.push(newRequest);
        todayRequests.push(newRequest);
      }
    }
    this.requestsDataSource.data = todayRequests;
  }

  // определяет, что указанный продукт product уже был заказан и будет привезен в будущем
  haveProductInFutureRequests(product: Product): boolean {
    for (const request of this.requests) {
      if (request.product === product && request.deliveryDate > this.currentDay) {
        return true;
      }
    }
    return false;
  }

  // считает, сколько сейчас на складе есть оптовых упаковок товара product
  getCountOfProduct(product: Product): number {
    return this.storageBoxes.filter(item => item.product.name === product.name).length;
  }

  // добавляет на склад продукты по исполняемой заявке request
  proceedRequest(request: Request) {
    for (let i = 0; i < request.numberOfBoxes; i++) {
      this.storageBoxes.push({
        product: request.product,
        deliveryDate: this.currentDay
      });
    }
  }
}
