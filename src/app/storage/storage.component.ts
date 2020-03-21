import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';

import { Product, Box } from './types';
import { StorageConstants } from './constants.helper';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss']
})
export class StorageComponent implements OnInit {

  StorageConstants = StorageConstants; // необходимо, чтобы переменная стала видимой для шаблона
  formGr: FormGroup;

  currentDay = 0;
  K = 12;
  M = 3;
  N = 30;
  knownProducts: Array<Product>;
  storageBoxes: Array<Box> = [];
  boxesDataSource = new MatTableDataSource<Box>();
  totalLosses = 0;
  todayLosses: Array<string> = [];

  constructor(
    private $fb: FormBuilder,
  ) {
    this.formGr = this.createFormGroup();
  }

  ngOnInit() {
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
  }

  stop() {
    console.log('stop');
    // тут должны быть нужные остановки и вывод статистики
  }

  // проверка просроченных товаров, удаление их со склада c учетом материальных потерь
  writeOffGoods() {
    // `Списана упаковка товара ${box.product.name} стоимостью ${box.product.price} ₽.`
    this.todayLosses = [];
    for (const box of this.storageBoxes) {
      if (box.deliveryDate + box.product.storagePeriod <= this.currentDay) {
        this.totalLosses += box.product.price;
        this.todayLosses.push(`Списана упаковка товара "${box.product.name}" стоимостью ${box.product.price} ₽.`);
      }
    }
    this.storageBoxes = this.storageBoxes.filter(item => item.deliveryDate + item.product.storagePeriod > this.currentDay);
    this.boxesDataSource.data = this.storageBoxes; // обновление данных в таблице
    console.log(this.totalLosses);
  }

}
