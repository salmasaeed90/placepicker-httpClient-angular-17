import { Component, DestroyRef, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit{

  userPlaces = this._PlacesService.loadedUserPlaces
  isFetching = signal(false);
  error = signal('');
  baseUrl = `http://localhost:3000`;

  constructor(private _HttpClient:HttpClient,
    private destroyRef:DestroyRef,
    private _PlacesService:PlacesService
  ){}


  ngOnInit(){
    this.isFetching.set(true)
    const subscription = this._PlacesService.loadUserPlaces().subscribe({
      error:(error:Error)=>{
        
        this.error.set(error.message);
      },
      complete:()=>{
        this.isFetching.set(false)
      }
    })

    this.destroyRef.onDestroy(()=>{
      subscription.unsubscribe();
    })
  }


  onRemovePlaces(place:Place){
    const subscription =this._PlacesService.removeUserPlace(place).subscribe({
      
    })

    this.destroyRef.onDestroy(()=>{
      subscription.unsubscribe();
    })
  }
}
