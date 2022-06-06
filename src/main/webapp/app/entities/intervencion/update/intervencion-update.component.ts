import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IIntervencion, Intervencion } from '../intervencion.model';
import { IntervencionService } from '../service/intervencion.service';
import { ICita } from 'app/entities/cita/cita.model';
import { CitaService } from 'app/entities/cita/service/cita.service';
import { IFactura } from 'app/entities/factura/factura.model';
import { FacturaService } from 'app/entities/factura/service/factura.service';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';

@Component({
  selector: 'jhi-intervencion-update',
  templateUrl: './intervencion-update.component.html',
})
export class IntervencionUpdateComponent implements OnInit {
  isSaving = false;

  citasSharedCollection: ICita[] = [];
  facturasSharedCollection: IFactura[] = [];
  clientesSharedCollection: ICliente[] = [];

  editForm = this.fb.group({
    id: [],
    titulo: [],
    precioUnitario: [],
    cita: [],
    factura: [],
    cliente: [],
  });

  constructor(
    protected intervencionService: IntervencionService,
    protected citaService: CitaService,
    protected facturaService: FacturaService,
    protected clienteService: ClienteService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ intervencion }) => {
      this.updateForm(intervencion);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const intervencion = this.createFromForm();
    if (intervencion.id !== undefined) {
      this.subscribeToSaveResponse(this.intervencionService.update(intervencion));
    } else {
      this.subscribeToSaveResponse(this.intervencionService.create(intervencion));
    }
  }

  trackCitaById(index: number, item: ICita): number {
    return item.id!;
  }

  trackFacturaById(index: number, item: IFactura): number {
    return item.id!;
  }

  trackClienteById(index: number, item: ICliente): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIntervencion>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(intervencion: IIntervencion): void {
    this.editForm.patchValue({
      id: intervencion.id,
      titulo: intervencion.titulo,
      precioUnitario: intervencion.precioUnitario,
      cita: intervencion.cita,
      factura: intervencion.factura,
      cliente: intervencion.cliente,
    });

    this.citasSharedCollection = this.citaService.addCitaToCollectionIfMissing(this.citasSharedCollection, intervencion.cita);
    this.facturasSharedCollection = this.facturaService.addFacturaToCollectionIfMissing(
      this.facturasSharedCollection,
      intervencion.factura
    );
    this.clientesSharedCollection = this.clienteService.addClienteToCollectionIfMissing(
      this.clientesSharedCollection,
      intervencion.cliente
    );
  }

  protected loadRelationshipsOptions(): void {
    this.citaService
      .query()
      .pipe(map((res: HttpResponse<ICita[]>) => res.body ?? []))
      .pipe(map((citas: ICita[]) => this.citaService.addCitaToCollectionIfMissing(citas, this.editForm.get('cita')!.value)))
      .subscribe((citas: ICita[]) => (this.citasSharedCollection = citas));

    this.facturaService
      .query()
      .pipe(map((res: HttpResponse<IFactura[]>) => res.body ?? []))
      .pipe(
        map((facturas: IFactura[]) => this.facturaService.addFacturaToCollectionIfMissing(facturas, this.editForm.get('factura')!.value))
      )
      .subscribe((facturas: IFactura[]) => (this.facturasSharedCollection = facturas));

    this.clienteService
      .query()
      .pipe(map((res: HttpResponse<ICliente[]>) => res.body ?? []))
      .pipe(
        map((clientes: ICliente[]) => this.clienteService.addClienteToCollectionIfMissing(clientes, this.editForm.get('cliente')!.value))
      )
      .subscribe((clientes: ICliente[]) => (this.clientesSharedCollection = clientes));
  }

  protected createFromForm(): IIntervencion {
    return {
      ...new Intervencion(),
      id: this.editForm.get(['id'])!.value,
      titulo: this.editForm.get(['titulo'])!.value,
      precioUnitario: this.editForm.get(['precioUnitario'])!.value,
      cita: this.editForm.get(['cita'])!.value,
      factura: this.editForm.get(['factura'])!.value,
      cliente: this.editForm.get(['cliente'])!.value,
    };
  }
}
