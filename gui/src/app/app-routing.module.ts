import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedirectComponent } from './redirect/redirect.component';
import { UrlDashboardComponent } from './url-dashboard/url-dashboard.component';

const routes: Routes = [
  { path: '', component: UrlDashboardComponent },
  { path: ':shortUrl', component: RedirectComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
