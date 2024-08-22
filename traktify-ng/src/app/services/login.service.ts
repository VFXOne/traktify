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
            if (isLoggedIn) {
              this.getUsername().subscribe(
                username => subscriber.next(username)
              );
            } else {
              this.http.get(this.url + 'login', {responseType: 'text'}).subscribe({
                next: (spotifyLoginUrl) => {
                  if (this.isSpotifyLoginURL(spotifyLoginUrl)) {
                    window.location.replace(spotifyLoginUrl);
                    subscriber.error(new Error('Please follow the spotify instructions'));
                  } else {
                    this.getUsername().subscribe(
                      username => subscriber.next(username)
                    );
                  }
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

  isLoggedIn(): Observable<boolean> {
    return this.http.get<boolean>(this.url + 'isLoggedIn');
  }

  private getUsername(): Observable<any> {
    return this.http.get(this.url + 'get-username', {responseType: 'text'});
  }

  private isSpotifyLoginURL(url: string): boolean {
    return url != null && url.length != 0 && url != "LOGGED_IN";
  }
}
