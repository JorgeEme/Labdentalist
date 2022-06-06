import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IFactura, Factura } from '../factura.model';
import { FacturaService } from '../service/factura.service';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';

@Component({
  selector: 'jhi-factura-update',
  templateUrl: './factura-update.component.html',
})
export class FacturaUpdateComponent implements OnInit {
  isSaving = false;

  clientesSharedCollection: ICliente[] = [];

  editForm = this.fb.group({
    id: [],
    numeroFactura: [],
    fechaEmision: [],
    tipoPago: [],
    fechaVencimiento: [],
    decripcion: [],
    subtotal: [],
    total: [],
    importePagado: [],
    importeAPagar: [],
    cliente: [],
  });

  constructor(
    protected facturaService: FacturaService,
    protected clienteService: ClienteService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ factura }) => {
      if (factura.id === undefined) {
        const today = dayjs().startOf('day');
        factura.fechaEmision = today;
        factura.fechaVencimiento = today;
      }

      this.updateForm(factura);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const factura = this.createFromForm();
    if (factura.id !== undefined) {
      this.subscribeToSaveResponse(this.facturaService.update(factura));
    } else {
      this.subscribeToSaveResponse(this.facturaService.create(factura));
    }
  }

  trackClienteById(index: number, item: ICliente): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFactura>>): void {
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

  protected updateForm(factura: IFactura): void {
    this.editForm.patchValue({
      id: factura.id,
      numeroFactura: factura.numeroFactura,
      fechaEmision: factura.fechaEmision ? factura.fechaEmision.format(DATE_TIME_FORMAT) : null,
      tipoPago: factura.tipoPago,
      fechaVencimiento: factura.fechaVencimiento ? factura.fechaVencimiento.format(DATE_TIME_FORMAT) : null,
      decripcion: factura.decripcion,
      subtotal: factura.subtotal,
      total: factura.total,
      importePagado: factura.importePagado,
      importeAPagar: factura.importeAPagar,
      cliente: factura.cliente,
    });

    this.clientesSharedCollection = this.clienteService.addClienteToCollectionIfMissing(this.clientesSharedCollection, factura.cliente);
  }

  protected loadRelationshipsOptions(): void {
    this.clienteService
      .query()
      .pipe(map((res: HttpResponse<ICliente[]>) => res.body ?? []))
      .pipe(
        map((clientes: ICliente[]) => this.clienteService.addClienteToCollectionIfMissing(clientes, this.editForm.get('cliente')!.value))
      )
      .subscribe((clientes: ICliente[]) => (this.clientesSharedCollection = clientes));
  }

  protected createFromForm(): IFactura {
    return {
      ...new Factura(),
      id: this.editForm.get(['id'])!.value,
      numeroFactura: this.editForm.get(['numeroFactura'])!.value,
      fechaEmision: this.editForm.get(['fechaEmision'])!.value
        ? dayjs(this.editForm.get(['fechaEmision'])!.value, DATE_TIME_FORMAT)
        : undefined,
      tipoPago: this.editForm.get(['tipoPago'])!.value,
      fechaVencimiento: this.editForm.get(['fechaVencimiento'])!.value
        ? dayjs(this.editForm.get(['fechaVencimiento'])!.value, DATE_TIME_FORMAT)
        : undefined,
      decripcion: this.editForm.get(['decripcion'])!.value,
      subtotal: this.editForm.get(['subtotal'])!.value,
      total: this.editForm.get(['total'])!.value,
      importePagado: this.editForm.get(['importePagado'])!.value,
      importeAPagar: this.editForm.get(['importeAPagar'])!.value,
      cliente: this.editForm.get(['cliente'])!.value,
    };
  }
}
