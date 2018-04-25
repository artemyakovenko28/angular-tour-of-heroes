import {Injectable} from '@angular/core';
import {Hero} from './hero';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {MessageService} from './message.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class HeroService {

  private heroesUrl = 'api/heroes';
  private httpOptions = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient,
              private messageService: MessageService) {
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(heroes => this.log('fetched heroes')),
      catchError(this.handleError('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(hero => this.log(`fetched hero by id = ${id}`)),
      catchError(this.handleError<Hero>(`getHero by id = ${id}`))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(hero => this.log(`added hero by id = ${hero.id}`)),
      catchError(this.handleError<Hero>(`addHero by id = ${hero.id}`))
    );
  }

  updateHero(hero: Hero): Observable<Hero> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(hero => this.log(`updated hero by id = ${hero.id}`)),
      catchError(this.handleError<any>(`updateHero by id = ${hero.id}`))
    );
  }

  deleteHero(hero: Hero): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(hero => this.log(`deleted hero by id = ${hero.id}`)),
      catchError(this.handleError(`deleteHero by id = ${hero.id}`))
    );
  }

  private log(message: string): void {
    this.messageService.add('HeroService: ' + message);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
