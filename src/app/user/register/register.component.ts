import { Component, DoCheck, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../services/auth.service';
import IUser from '../../models/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private auth: AuthService, private emailTaken: EmailTaken) { }

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email], [this.emailTaken.validate]),
    age: new FormControl<number | null>(null, [Validators.required, Validators.min(18), Validators.max(120)]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.[a-zA=Z]).{8,}$/gm)]),
    confirm_password: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(17)]),
  }, [RegisterValidators.match('password', 'confirm_password')])

  showAlert = false
  alertMsg = 'Please wait! Your account is being created.'
  alertColor = 'blue'
  inSubmition = false

  async register() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created.'
    this.alertColor = 'blue'
    this.inSubmition = true

    try {
      await this.auth.createUser(this.registerForm.value as IUser)
      this.inSubmition = false
    } catch (error) {
      console.error(error)

      this.alertMsg = 'An unexpected error occured. Please try again later.'
      this.alertColor = 'red'
      this.inSubmition = false
      return
    }

    this.alertMsg = 'User creation success.'
    this.alertColor = 'green'
  }
}
