import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Country, Currency } from "./models";
import { CountriesService } from "./countries.service";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

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
export class AppComponent implements OnInit {

  protected currencies = signal(new Set<Currency>());
  protected inputFocus = signal(false);
  protected filteredCountries = signal<Country[]>([]);
  protected countries: Country[] = [];

  protected inputControl = new FormControl<string>("");

  @ViewChild('select') selectElement!: ElementRef<HTMLSelectElement>;

  constructor(
    private countriesService: CountriesService,
  ) {
  }
  ngOnInit(): void {
    this.countriesService.getCurrencies().subscribe({
      next: currencies => this.currencies.set(currencies)
    })
    this.countriesService.getAllCountries().subscribe({
      next: countries => {
        this.countries = countries;
        this.filteredCountries.set(this.countries)
      }
    })

    this.inputControl.valueChanges.subscribe({
      next: value => {
        if (value)
          this.filteredCountries.set(this.countries.filter(country => {
            return country.name.common.toLowerCase().includes(value.toLowerCase());
          }));
        else
          this.filteredCountries.set(this.countries);
      }
    })
  }

  onSelectChange() {
    this.inputControl.setValue("");
    if (this.selectElement.nativeElement.value === "None") {
      this.countriesService.getAllCountries().subscribe({
        next: countries => {
          this.countries = countries;
          this.filteredCountries.set(countries);
        }
      })
    } else {
      this.countriesService.getCountriesByCurrency(this.selectElement.nativeElement.value).subscribe({
        next: countries => {
          this.countries = countries;
          this.filteredCountries.set(countries);
        }
      })
    }
  }

  protected readonly console = console;

  onBlur() {
    setTimeout(() => (this.inputFocus.set(false)), 100);
  }

  selectCountry(countryName: string) {
    this.inputControl.setValue(countryName);
  }
}
