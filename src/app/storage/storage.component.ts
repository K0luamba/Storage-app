import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';

import { Product, Box, Order, Store, OrderItem } from './types';
import { StorageConstants } from './constants.helper';
import { TableHelper } from './table.helper';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss']
})
export class StorageComponent implements OnInit {

  StorageConstants = StorageConstants; // необходимо, чтобы переменная стала видимой для шаблона
  TableHelper = TableHelper;
  formGr: FormGroup;

  currentDay = 0;
  K = 12;
  M = 3;
  N = 30;
  knownProducts: Array<Product>;
  storageBoxes: Array<Box> = [];
  ordersDataSource = new MatTableDataSource<OrderItem>();
  boxesDataSource = new MatTableDataSource<Box>();
  stores: Array<Store>;
  MIN_ORDER_POINTS = 0;
  MAX_ORDER_POINTS = 3;
  MIN_BOXES_TO_ORDER = 1;
  MAX_BOXES_TO_ORDER = 5;
  totalLosses = 0;
  todayLosses: Array<string> = [];

  constructor(
    private $fb: FormBuilder,
  ) {
    this.formGr = this.createFormGroup();
  }

  ngOnInit() {
    this.ordersDataSource.data = null;
  }

  // случайное целое число от min до max
  randomInteger(min, max): number {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  private createFormGroup(): FormGroup {
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
    this.boxesDataSource.data = this.storageBoxes;

    this.stores = StorageConstants.stores.slice(0, this.M);
    console.log(this.stores);

    this.step();
  }

  step() {
    this.currentDay += 1;
    if (this.currentDay - 1 === this.N) { // отнимаем 1, чтобы закончить, условно, в 31-ый день, если N = 30
      this.stop();
    }
    console.log('день:', this.currentDay);
    // тут идут все действия этого дня
    // перевозки
    this.writeOffGoods();
    this.generateOrders();
  }

  stop() {
    console.log('stop');
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
    this.boxesDataSource.data = this.storageBoxes; // обновление данных в таблице
    // console.log('суммарные потери:', this.totalLosses);
  }

  // проход по торговым точкам и генерация заказов
  generateOrders() {
    this.ordersDataSource.data = [];
    const ordersData = [];
    for (const store of this.stores) {
      store.orders = []; // предыдущие заказы забываем, так как они либо исполнены, либо отклонены
      const numberOfItems = this.randomInteger(this.MIN_ORDER_POINTS, this.MAX_ORDER_POINTS);
      console.log('добавим продуктов:', numberOfItems);
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
        console.log('добавили заказ:', store);
      }
    }
    this.ordersDataSource.data = ordersData;
  }

}
