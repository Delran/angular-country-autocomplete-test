import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { Country, Currency } from "./models";

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor(
    private http: HttpClient,
  ) { }

  getCountriesByCurrency(currencyCode: string) {
    return this.http.get<Country[]>("https://restcountries.com/v3.1/currency/" + currencyCode);
  }

  getAllCountries() {
    return this.http.get<Country[]>("https://restcountries.com/v3.1/all/");
  }

  getCurrencies(): Observable<Map<string, Currency>> {
    return this.http.get<Country[]>("https://restcountries.com/v3.1/all/").pipe(
      map(countries => {
        let currencies = new Map<string, Currency>();
        countries.forEach(country => {
          if (country.currencies) {
            for (const currencyCode in country.currencies) {
              if (!currencies.has(currencyCode)) {
                currencies.set(currencyCode, country.currencies[currencyCode])
              }
            }
          }
        });
        return currencies;
      })
    )
  }
}
