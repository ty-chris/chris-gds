import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { UrlPairModel } from '../models/url-pair.model';
import { UrlService } from '../services/url.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss'],
})
export class RedirectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private urlService: UrlService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      console.log('params', params['shortUrl']);
      const urlPair$ = this.urlService.getUrlPair(params['shortUrl']);

      const urlPair = await lastValueFrom(urlPair$).catch((err) =>
        this.router.navigate([''])
      );
      if (urlPair.full_url) {
        console.log('full', urlPair.full_url);
        urlPair.full_url = this.urlService.convertToFullLink(urlPair.full_url);

        window.location.href = urlPair.full_url;
      }
    });
  }
}
