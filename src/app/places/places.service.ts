import { Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  baseUrl = `http://localhost:3000`;

  constructor(private _HttpClient:HttpClient,
    private _ErrorService:ErrorService){}

  loadAvailablePlaces() {
    return this.fetchPlaces(this.baseUrl + `/places` , 'somethimg went wrong fetching the available places, pleasw tray again later.')
  }

  loadUserPlaces() {
    return this.fetchPlaces(this.baseUrl + `/user-places` , 'somethimg went wrong fetching your favorite places, pleasw tray again later')
    .pipe(
      //excute code as we do with subscribe without subscribe // update that data without subscribe 
      tap({
        next:(userPlaces)=> this.userPlaces.set(userPlaces)
      })

    )

  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces();

    //check if place is not part of userplaces 
    if (!prevPlaces.some((p) => p.id === place.id)){
      this.userPlaces.set([...prevPlaces, place]);
    }

    return this._HttpClient.put(this.baseUrl + `/user-places`, {placeId: place.id}).pipe(
      catchError((error)=>{
        this.userPlaces.set(prevPlaces);
        this._ErrorService.showError('failed to store selected place.')
        return throwError(()=>new Error('failed to store selected place.'))
      })
    )
  }

  removeUserPlace(place: Place) {
    const prevPlaces = this.userPlaces();

    if (prevPlaces.some((p) => p.id === place.id)){
      this.userPlaces.set(prevPlaces.filter((p)=> p.id !== place.id));
    }

    return this._HttpClient.delete(this.baseUrl + `/user-places/`+ place.id).pipe(
      catchError((error)=>{
        
        this.userPlaces.set(prevPlaces);
        this._ErrorService.showError('failed to remove selected place.')
        return throwError(()=>new Error('failed to remove selected place.'))
      })
    )
  }

  private fetchPlaces (url:string, errorMessage:string){
    return this._HttpClient
    .get<{places:Place[]}>(url)
    .pipe(
      map((response)=>response.places),
      //catchError return observable in throwError method => generate obs
      catchError((error) =>
      {
        console.error(error)
      return throwError(()=>new Error(errorMessage))})
  )
  }
}
