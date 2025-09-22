import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {NotesService} from '../../services/notes.service';
import * as notesActions from '../actions/notes.actions';
import {Observable, of} from 'rxjs';
import {Action} from '@ngrx/store';
import { map, switchMap, tap, startWith } from 'rxjs/operators';


@Injectable()

export class NotesEffects {

  listNotes$ = createEffect(() => this.actions$.pipe(
      ofType(notesActions.LIST_NOTES), // requesting the socket server to list the notes for us
      startWith(new notesActions.NotesListed()), // List notes automatically when applications starts
      tap(() => this.notesService.listNotes())
    ), {dispatch: false});

  notesListed$: Observable<Action> = createEffect(() => 
      this.notesService.notesListed$.pipe( // listen to the socket for NOTES LIST event
      switchMap(notes =>
          of(new notesActions.NotesListed(notes)) // ask the the store to populate the notes
      ))
    );

  addNote$ = createEffect(() => this.actions$.pipe(
      ofType(notesActions.ADD_NOTE),
      map((action: notesActions.AddNote) => action.payload),
      tap((note) => this.notesService.addNote(note))
    ), {dispatch: false});

  noteAdded$: Observable<Action> = createEffect(() =>
      this.notesService.noteAdded$.pipe(
      switchMap(note =>
          of(new notesActions.NoteAdded(note))
      ))
    );

  updateNote$ = createEffect(() => this.actions$.pipe(
      ofType(notesActions.UPDATE_NOTE),
      map((action: notesActions.UpdateNote) => action.payload),
      tap((note) => this.notesService.updateNote(note))
    ), {dispatch: false});

  noteUpdated$: Observable<Action> = createEffect(() =>
      this.notesService.noteUpdated$.pipe(
      switchMap(note =>
          of(new notesActions.NoteUpdated(note))
      ))
    );

  deleteNote$ = createEffect(() => this.actions$.pipe(
      ofType(notesActions.DELETE_NOTE),
      map((action: notesActions.UpdateNote) => action.payload),
      tap((note) => this.notesService.deleteNote(note))
    ), {dispatch: false});

  noteDeleted$: Observable<Action> = createEffect(() => 
      this.notesService.noteDeleted$.pipe(
      switchMap(note =>
          of(new notesActions.NoteDeleted(note))
      ))
    );

  constructor(private actions$: Actions, private notesService: NotesService) {}
}
