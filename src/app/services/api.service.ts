import { HttpClient } from '@angular/common/http';
import { Jsonp } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import * as config from '../config';

// const FLICKR_SEARCH_URL =
//         'https://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=JSONP_CALLBACK&tagmode=all&tags=';
@Injectable()
export class ApiService {
  FLICKR_SEARCH_URL = config.default.FLICKR_SEARCH_URL;
  FM_ARTIST_SEARCH_URL = config.default.FM_ARTIST_SEARCH;
  FM_API_KEY = config.default.FM_API_KEY;
  constructor(
    private _jsonp: Jsonp,
    private http: HttpClient) { }

  /****
   * It's kind of disaster, I think this is an easy call. But endup, I spend 2 hours on this.
   * 1. using httpclient and http, CORS issue came.
   * 2. google a bit - found it's should use jsonp.
   * 2.1 - jsonp resolve the cors error
   * 2.2 - jsoncallback=JSONP_CALLBACK vs nojsoncallback=1
   * 2.2.1 - nojsoncallback=1 return nice json, but jsonp - get error of  Unexpected token : for jsonp flickr when .map(res => res.json)
   * 2.2.2 - jsoncallback=JSONP_CALLBACK, jsonp return with no error, but failed when call .map(res => res.json)
   * Solution: not to use .map(res => res.json), parse http response in a traditional fashion in consumer side
   */
  searchFlickr(queryString: string): Observable<any> {
    return this._jsonp
      .get(`${this.FLICKR_SEARCH_URL}${queryString}`)
      .catch( (e: any) => {
        return this._handleError(e);
      });
  }

  // search fm
  // searchFmArtist(queryString: string): Observable<any> {
  //   return this.http
  //     .get(`${this.FM_ARTIST_SEARCH_URL}${queryString}&${this.FM_API_KEY}`)
  //     .catch(this._handleError);
  // }
  searchFmArtist(queryString: string): Observable<any> {
    return this.http
      .get('https://wt-35f0549d5d3272a0845c1b062e1645c6-0.run.webtask.io/20171116',  {observe: 'response'})
      .catch(this._handleError);
  }

  private _handleError(err: any) {
    console.log('_handleError');
    const errorMsg = err.message || 'Error: Unable to complete request.';
    return Observable.throw(errorMsg);
  }
}
