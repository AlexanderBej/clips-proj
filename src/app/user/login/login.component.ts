import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import IUserCredentials from '../../models/user-credentials.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  credentials: IUserCredentials = {
    email: '',
    password: ''
  }

  showAlert = false
  alertMsg = 'Please wait while we log you in!'
  alertColor = 'blue'
  inSubmition = false


  constructor(private auth: AuthService) { }

  async login() {
    this.showAlert = true
    this.alertMsg = 'Please wait while we log you in!'
    this.alertColor = 'blue'
    try {
      await this.auth.loginUser(this.credentials)
      this.inSubmition = false
    } catch (error) {
      this.inSubmition = false

      this.alertMsg = 'An unexpected error occured. Please try again later.'
      this.alertColor = 'red'
      console.error(error)
      return
    }

    this.alertMsg = 'You are logged in. Welcome!'
    this.alertColor = 'green'
  }
}
