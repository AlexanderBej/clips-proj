import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';
import { Observable, filter, map, of, switchMap } from 'rxjs';
import IUserCredentials from '../models/user-credentials.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usersCollection: AngularFirestoreCollection<IUser>
  public isAuthenticated$: Observable<boolean>
  public redirect = false

  constructor(private auth: AngularFireAuth, private db: AngularFirestore, private router: Router, private route: ActivatedRoute) {
    this.usersCollection = this.db.collection('users')
    this.isAuthenticated$ = auth.user.pipe(map(user => !!user))

    router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => route.firstChild),
      switchMap(route => route?.data ?? of({ authOnly: false }))
    ).subscribe(data => {
      this.redirect = data.authOnly ?? false
    })
  }

  public async createUser(userData: IUser) {
    if (!userData.password) {
      throw new Error("Password is not provided!")
    }
    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email as string, userData.password as string
    )

    if (!userCred.user) {
      throw new Error("User can't be found!")
    }

    const userToAdd = {
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber
    }

    await this.usersCollection.doc(userCred.user.uid).set(userToAdd)

    userCred.user.updateProfile({
      displayName: userData.name
    })
  }

  public async loginUser(userData: IUserCredentials) {
    await this.auth.signInWithEmailAndPassword(userData.email, userData.password)
  }

  public async logoutUser() {
    await this.auth.signOut()

    if(this.redirect) {
      await this.router.navigateByUrl('/')
    }
  }
}
