import { Component, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CreateReportItemDialogComponent, ReportItem } from './create-report-item.component';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'ps-create-report',
    templateUrl: './create-report.component.html',
    styleUrls: ['./create-report.component.css']
})
export class CreateReportComponent {

    dataSource: ReportItemsDataSource;
    displayedColumns = ['description', 'amount', 'hasReceipt'];
    itemsDataBase: ReportItemDatabase;

    constructor(private location: Location,
        private dialog: MatDialog) {
        this.itemsDataBase = new ReportItemDatabase();
        this.dataSource = new ReportItemsDataSource(this.itemsDataBase);
    }

    cancel(): void {
        this.location.back();
    }

    addItem(): void {
        const dialogRef = this.dialog.open(CreateReportItemDialogComponent, {
            width: '525px',
        });
        dialogRef.afterClosed().subscribe(item => {
            this.itemsDataBase.addReportItem(item);
        });
    }
}

class ReportItemDatabase {
    dataChange = new BehaviorSubject<ReportItem[]>([]);

    get data(): ReportItem[] {
        return this.dataChange.value;
    }

    addReportItem(item: ReportItem) {
        const newData = [...this.data, item];
        this.dataChange.next(newData);
    }
}

class ReportItemsDataSource extends DataSource<any> {

    constructor(private sourceDatabase: ReportItemDatabase) {
        super();
    }

    connect(): Observable<ReportItem[]> {
        return this.sourceDatabase.dataChange.map(data => data);
    }

    disconnect() { }
}
