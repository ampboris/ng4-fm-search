import { Component, OnDestroy } from '@angular/core';
import { ApiService } from './services/api.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'app';
  searchTerm = '';
  items: any[];
  loading = false;
  searchSub: Subscription;

  constructor(private api: ApiService) {
  }

  ngOnDestroy() {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
  }

  search() {
    if ( this.searchTerm.length < 3 ) { return; }
    this.loading = true;
    this.searchSub = this.api.searchFlickr(this.searchTerm).subscribe(
      (resp) => {
        this.loading = false;
        try {
          // console.log(resp);
          // data availability check
          if (resp && resp._body && resp._body.items && resp._body.items.length > 0) {
            this.items = resp._body.items;
            // process tags into array
            this.items.map(item => {
              const tagArray = item.tags.split(' ');
              item.tags = tagArray.map((tagItem) => {
                return { value: tagItem, isSearchTerm: this.searchTerm.indexOf(tagItem) >= 0 ? true : false };
              });
            });
          } else {
            this.handleError(`Opps, your search for ${this.searchTerm} returned no results`, 'no-results');
          }
        } catch (e) {
          console.error('process error', e);
          this.handleError(`Opps, your search for ${this.searchTerm} returned process error`, 'process-error');
        }
      },
      (err) => {
        this.loading = false;
        console.error('service error', err);
        this.handleError(`Opps, your search for ${this.searchTerm} returned error`, 'search-error');
      }
    );
  }

  searchFm() {
    if ( this.searchTerm.length < 3 ) { return; }
    this.loading = true;
    this.searchSub = this.api.searchFmArtist(this.searchTerm).subscribe(
      (rsp) => {
        this.loading = false;
        try {
          console.log(rsp.headers);
          console.log(rsp.headers.get('x-auth'));
          console.log(rsp.body);
          const resp = rsp.body;
          // data availability check
          if (resp && resp.results && resp.results.artistmatches && resp.results.artistmatches.artist.length > 0) {
            this.items = resp.results.artistmatches.artist;
            // process tags into array
            this.items.map(item => {
              // console.log(item.image[1][Object.keys(item.image[1])[0]]);
              let thisUrl = item.image[2][Object.keys(item.image[2])[0]];
              if(!thisUrl) {
                thisUrl = 'https://lastfm-img2.akamaized.net/i/u/avatar170s/2a96cbd8b46e442fc41c2b86b821562f';
              }
              item.imageUrl = thisUrl;
            });
          } else {
            this.handleError(`Opps, your search for ${this.searchTerm} returned no results`, 'no-results');
          }
        } catch (e) {
          console.error('process error', e);
          this.handleError(`Opps, your search for ${this.searchTerm} returned process error`, 'process-error');
        }
      },
      (err) => {
        this.loading = false;
        console.error('service error', err);
        this.handleError(`Opps, your search for ${this.searchTerm} returned error`, 'search-error');
      }
    );
  }

  handleError (message: string, tag: string) {
    this.items = [{
      'title': message,
      'author': 'Flickr lover',
      'link': '#',
      'media': { 'm': '' },
      'tags': [{value: tag, isSearchTerm: true}]
    }];
  }
  keyup(event: any) {
    // console.log('keyup event:', event);
    if (event.which === 13) {
      event.preventDefault();
      // this.search();
      this.searchFm();
    } else {
      return;
    }
  }

}
