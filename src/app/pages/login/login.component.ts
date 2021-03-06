import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;
  rememberMe: boolean;
  loginFailed = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.authenticationService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  async login() {
    this.loading = true;
    try {
      this.authenticationService.setRememberMe(this.rememberMe);
      const loginResponse = await this.authenticationService.login(this.model.username, this.model.password);
      if (!loginResponse) {
        console.warn('login.component::login:: login error, TODO: add message for login fail');
        this.loginFailed = true;
        return;
      }
      this.loginFailed = false;
      this.router.navigate([this.returnUrl]);
    } catch (err) {
      console.error(`login.component::login:: error in authentication ${err}`);
      this.loginFailed = true;
      // TODO: handle error in authetication
    } finally {
      this.loading = false;
    }
  }
}
