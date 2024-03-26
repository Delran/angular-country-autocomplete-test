import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Country, Currency } from "./models";
import { CountriesService } from "./countries.service";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {

  protected inputFocus = signal(false);
  protected currenciesKeys = signal(new Array<string>());
  protected filteredCountries = signal<Country[]>([]);

  protected currenciesMap = new Map<string, Currency>();
  protected countries = new Array<Country>();

  protected inputControl = new FormControl<string>("");
  protected selectControl = new FormControl<string>("None", {nonNullable: true});

  private destroySubscription = new Subject<void>();

  constructor(
    private countriesService: CountriesService,
  ) {
  }
  ngOnInit(): void {
    this.countriesService.getCurrencies().subscribe({
      next: currencies => {
        this.currenciesMap = currencies;
        this.currenciesKeys.set(Array.from(this.currenciesMap.keys()));
      }
    })
    this.countriesService.getAllCountries().subscribe({
      next: countries => {
        this.setCountries(countries);
      }
    })

    this.inputControl.valueChanges.pipe(takeUntil(this.destroySubscription)).subscribe({
      next: value => {
        if (value)
          this.filteredCountries.set(this.countries.filter(country => {
            return country.name.common.toLowerCase().includes(value.toLowerCase());
          }));
        else this.filteredCountries.set(this.countries);
      }
    })

    this.selectControl.valueChanges.pipe(takeUntil(this.destroySubscription)).subscribe({
      next: selectedCurrency => {
        this.inputControl.reset();
        if (selectedCurrency !== "None") {
          this.countriesService.getCountriesByCurrency(selectedCurrency).subscribe({
            next: countries => {
              this.setCountries(countries);
            }
          })
        } else {
          this.countriesService.getAllCountries().subscribe({
            next: countries => {
              this.setCountries(countries);
            }
          })
        }
      }
    })
  }

  ngOnDestroy() {
    this.destroySubscription.next();
    this.destroySubscription.complete();
  }

  protected onBlur() {
    setTimeout(() => (this.inputFocus.set(false)), 100);
  }

  private setCountries(countries: Country[]) {
    this.countries = countries;
    this.filteredCountries.set(this.countries);
  }
}
