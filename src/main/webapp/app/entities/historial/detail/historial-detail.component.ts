import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHistorial } from '../historial.model';

@Component({
  selector: 'jhi-historial-detail',
  templateUrl: './historial-detail.component.html',
})
export class HistorialDetailComponent implements OnInit {
  historial: IHistorial | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ historial }) => {
      this.historial = historial;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
