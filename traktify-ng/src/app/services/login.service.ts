import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  login(): Observable<string> {
    if (environment.dummyData) {
      return of('Dummy username');
    } else {
      return new Observable(subscriber => {
        this.http.get<boolean>(this.url + 'isLoggedIn').subscribe({
          next: (isLoggedIn) => {
            console.log('IsLoggedIn: ', isLoggedIn);
            if (isLoggedIn) {
              this.http.get(this.url + 'get-username', {responseType: 'text'}).subscribe(
                username => subscriber.next(username)
              );
            } else {
              this.http.get(this.url + 'login', {responseType: 'text'}).subscribe({
                next: (spotifyLoginUrl) => {
                  console.log('server response: ' + spotifyLoginUrl);
                  window.location.replace(spotifyLoginUrl);
                  subscriber.error(new Error('Please follow the spotify instructions'));
                },
                error: (error) => subscriber.error(error)
              });
            }
          },
          error: (error) => subscriber.error(error)
        });
      });
    }
  }
}
