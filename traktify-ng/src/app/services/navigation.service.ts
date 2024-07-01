import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class NavigationService {

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  openPlaylist(id: string) {
    this.router.navigate(['playlist', id]);
  }
}
