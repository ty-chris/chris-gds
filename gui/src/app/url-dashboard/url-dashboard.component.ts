import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  form = new FormGroup({
    full_url: new FormControl('', [Validators.required]),
    short_url: new FormControl(''),
    custom: new FormControl(false),
  });

  constructor(private urlService: UrlService) {
    this.custom?.valueChanges.subscribe((change) => {
      console.log('change', change);
      if (change) {
        this.short_url!.enable();
        console.log('enable');
      } else {
        this.short_url!.disable();
        console.log('disable');
      }
    });
  }
  async ngOnInit(): Promise<void> {
    const pastUrls$ = this.urlService.getAllUrls();
    const pastUrls = await lastValueFrom(pastUrls$).catch((err) => console.log('e'));

    if (pastUrls.length > 0) {
      this.history = pastUrls;
      console.log(pastUrls);
    }
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

  async createUrlPair() {
    const urlPair = {
      short_url: this.short_url?.value,
      full_url: this.full_url?.value,
    };

    const create$ = this.urlService.createUrl(urlPair);
    const created = await lastValueFrom(create$).catch((err) => console.log('e', err));

    if (created && created.short_url) {
      const baseUrl = window.location.host;
      this.createdUrl = baseUrl + `/${created.short_url}`;
    }
  }
}
