import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { UrlPairModel } from '../models/url-pair.model';
import { UrlService } from '../services/url.service';

@Component({
  selector: 'app-url-dashboard',
  templateUrl: './url-dashboard.component.html',
  styleUrls: ['./url-dashboard.component.scss'],
})
export class UrlDashboardComponent implements OnInit {
  history: UrlPairModel[];
  createdUrl: string;
  isCustomUrl: boolean;

  currHost: string;

  form: FormGroup;

  constructor(private urlService: UrlService, private router: Router) {}
  async ngOnInit(): Promise<void> {
    this.currHost = window.location.host + '/';
    this.initForm();

    const pastUrls$ = this.urlService.getAllUrls();
    const pastUrls = await lastValueFrom(pastUrls$).catch((err) =>
      console.log('e')
    );

    if (pastUrls && pastUrls.length > 0) {
      this.history = pastUrls;
      console.log(pastUrls);
    }
  }

  initForm(): void {
    this.form = new FormGroup({
      full_url: new FormControl('', [Validators.required]),
      short_url: new FormControl(''),
      custom: new FormControl(false),
    });

    this.short_url?.disable();

    this.custom?.valueChanges.subscribe((change) => {
      console.log('change', change);
      if (change) {
        this.short_url!.enable();
        this.short_url?.addValidators([Validators.required]);
      } else {
        this.short_url!.disable();
        this.short_url?.removeValidators([Validators.required]);
      }
    });
  }

  get full_url() {
    return this.form.get('full_url');
  }

  get short_url() {
    return this.form.get('short_url');
  }

  get custom() {
    return this.form.get('custom');
  }

  getShortUrl(short_key: string): string {
    return this.currHost + short_key;
  }

  navigateTo(short_key: string): void {
    const url = this.getShortUrl(short_key);
    this.router.navigate([short_key]);
  }

  async createUrlPair() {
    const urlPair = {
      short_url: this.short_url?.value,
      full_url: this.full_url?.value,
    };

    const create$ = this.urlService.createUrl(urlPair);
    const created = await lastValueFrom(create$).catch((err) =>
      console.log('e', err)
    );

    if (created && created.short_url) {
      const baseUrl = window.location.host;
      this.createdUrl = baseUrl + `/${created.short_url}`;
    }
  }
}
