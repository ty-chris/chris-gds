import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  createdUrl: string | undefined;
  createdShortKey: string | undefined;
  isCustomUrl: boolean;

  currHost: string;
  errMsg: string | undefined;
  form: FormGroup;

  constructor(
    private urlService: UrlService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.currHost = window.location.host + '/';
    this.initForm();
  }

  async ngOnInit(): Promise<void> {
    await this.initPastUrls();
  }

  async initPastUrls(): Promise<void> {
    const pastUrls$ = this.urlService.getAllUrls();
    const pastUrls = await lastValueFrom(pastUrls$).catch((err) =>
      console.log('Error: ', err)
    );

    if (pastUrls && pastUrls.length > 0) {
      pastUrls.reverse();
      this.history = pastUrls;
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
      if (change) {
        this.short_url!.enable();
        this.short_url?.addValidators([Validators.required]);
      } else {
        this.short_url!.disable();
        this.short_url?.removeValidators([Validators.required]);
      }

      this.cd.detectChanges();
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
    console.log('short_key', short_key);
    this.router.navigate([short_key]);
  }

  async createUrlPair() {
    let urlPair;
    if (this.custom && this.custom?.value) {
      urlPair = {
        short_url: this.short_url?.value,
        full_url: this.full_url?.value,
      };
    } else {
      urlPair = {
        full_url: this.full_url?.value,
      };
    }

    const create$ = this.urlService.createUrl(urlPair);
    const created = await lastValueFrom(create$).catch((err) => {
      this.createdUrl = undefined;
      this.createdShortKey = undefined;
      this.errMsg = this.custom?.value
        ? 'Unable to create shortened URL, custom URL might have been taken already.'
        : 'Unable to create shortened URL, please try again later.';
    });

    if (created && created.short_url) {
      this.errMsg = undefined;
      const baseUrl = window.location.host;
      this.createdUrl = baseUrl + `/${created.short_url}`;
      this.createdShortKey = created.short_url;

      // Update list of past Urls
      await this.initPastUrls();
    }
  }
}
