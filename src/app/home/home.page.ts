import { Component, OnInit } from '@angular/core';
import { DataService } from "../services/data.service";
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage implements OnInit {
  symbols: any;
  curAmount: any = '1.00';
  isOpen: boolean = false;
  seleCur: string = '';
  codeCur: any = '';
  descCur: any;
  convData: any = [];
  ratesData: any = [];
  searchTerm:any;
  feltringDAta:any;
  feltringDAta2:any;
  searchTerm2:any;


  constructor(
    private dataServer: DataService,
    public loader: LoadingController,
  ) {}

  ngOnInit() {
    this.getSymbols();
  }

  filter() {
    this.convData=this.feltringDAta;
    let dataArray = [];
    for (let i = 0; i < this.convData.length; i++) {
      if (this.convData[i].name && this.convData[i].name.includes(this.searchTerm)) {
        dataArray.push(this.convData[i]);
      }
    }
    this.convData=dataArray;
    console.log(dataArray);
  }

  filter2() {
    this.symbols=this.feltringDAta2;
    let dataArray = [];
    for (let i = 0; i < this.symbols.length; i++) {
      if (this.symbols[i].code && this.symbols[i].code.includes(this.searchTerm2)) {
        dataArray.push(this.symbols[i]);
      }
    }
    this.symbols=dataArray;
    console.log(dataArray);
  }


  async getSymbols() {
    await this.dataServer.getSymbols().then((data: any) => {
      this.symbols = [];
      console.log(this.symbols)
      for (var key in data.symbols) {
        if (data.symbols.hasOwnProperty(key)) {
          this.symbols.push({ "code": data.symbols[key].code, "desc": data.symbols[key].description });
        }
      }
    });
    this.feltringDAta2=this.symbols;
  }

  async convertCurrency(base: string , amount: number) {
    this.symbols=this.feltringDAta2;
    await this.dataServer.convCur(base, amount).then((data: any) => {
      this.ratesData = Object.keys(data.rates)
        .map(key => ({ name: key, value: data.rates[key] }))
    });
    this.convData = [];
    for (let i = 0; i < this.symbols.length; i++) {
      this.convData.push({
        ...this.symbols[i],
        ...(this.ratesData.find((itmInner:any) => itmInner.name === this.symbols[i].code))
      });

    }
    this.feltringDAta=this.convData;
  }

  async getRates() {
    const loading = await this.loader.create({
      message: 'Changing the currency',
      duration: 2000
    });
    await loading.present();
    await this.convertCurrency(this.codeCur, this.curAmount);
  }

  selectedCur(ev: any) {
    let selCur = ev.detail.value;
    let a = selCur.split("|");
    this.codeCur = a[0];
    this.descCur = a[1];
    this.seleCur = a[0] + ' - ' + a[1];
  }
}
