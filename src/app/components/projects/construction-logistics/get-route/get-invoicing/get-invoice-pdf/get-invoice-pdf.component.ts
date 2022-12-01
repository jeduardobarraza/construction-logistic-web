import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
//import { I18Service } from 'src/app/services/i18.service';
import { logo } from 'src/app/shared';

@Component({
  selector: 'app-get-invoice-pdf',
  templateUrl: './get-invoice-pdf.component.html',
  styleUrls: ['./get-invoice-pdf.component.scss']
})
export class GetInvoicePdfComponent implements OnInit {
  id: any;

  invoice = '';
  item = '';
  mtUnit = '';
  mtSupplyUnitValue = '';
  mtSupplyUnitInstallation = '';
  supplyUnitValue = '';
  supplyUnitInstallation = '';
  quantity = '';
  supplySubtotal = '';
  installationSubtotal = '';
  totalSupplyInstallation = '';
  utility = '';

  direction = '';
  city = '';
  businessName = '';
  cityDate = '';
  name = '';
  construction = '';
  owesTo = '';
  cordially = '';
  signature = '';
  nota = '';

  pagActual = 1;

  invoiceTable = {
    byUnit: 'Por Unidades',
    squareMeter: 'Por Mt²',
    byUnitSquareMeter: 'Por Unidades y Mt²',
    invoice: 'Factura',
    item: 'ITEM',
    supplyUnitValue: 'VR. UNITARIO SUMINISTRO',
    supplyUnitInstallation: 'VR. UNITARIO INSTALACION',
    mtUnit: 'Mt² Unidad',
    mtSupplyUnitValue: 'VR. UNITARIO SUMINISTRO Mt²',
    mtSupplyUnitInstallation: 'VR. UNITARIO INSTALACION Mt²',
    quantity: 'CANTIDAD',
    supplySubtotal: 'SUBTOTAL SUMINISTRO',
    installationSubtotal: 'SUBTOTAL INSTALACION',
    utility: 'Utilidad 5%',
    totalSupplyInstallation: 'TOTAL SUMINISTRO E INSTALACION',

    direction: 'Bosque Transv. 54 No. 19-52',
    city: 'Cartagena de Indias - Colombia',
    businessName: 'CIFRIC SAS',
    cityDate: 'Cartagena de Indias, D.T. y C., date',
    name: 'JEFFREY ALONSO ESPINEL P',
    construction: 'PORTALES DE SAN JOSE 123',
    owesTo: 'DEBE A',
    cordially: 'Cordialmente',
    signature: 'JAIME CIFUENTES',
    nota: 'En caso de ser aprobada esta cotización, sírvase hacer consignación o transferencia en la cuenta Bancolombia: cuenta de ahorro No. 78671515322 a nombre de CIFRIC SAS. El comprobante de consignación o transferencia, favor enviarlo vía email a servicioalcliente@latelier.com.co'
  };

  constructor(
    //private i18: I18Service,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = data.id;
  }

  ngAfterViewInit(): void {
    setTimeout(async () => {
      this.invoice = this.invoiceTable.invoice;
      this.item = this.invoiceTable.item;
      this.mtUnit = this.invoiceTable.mtUnit;
      this.mtSupplyUnitValue = this.invoiceTable.mtSupplyUnitValue;
      this.mtSupplyUnitInstallation =
        this.invoiceTable.mtSupplyUnitInstallation;
      this.supplyUnitValue = this.invoiceTable.supplyUnitValue;
      this.supplyUnitInstallation = this.invoiceTable.supplyUnitInstallation;
      this.quantity = this.invoiceTable.quantity;
      this.supplySubtotal = this.invoiceTable.supplySubtotal;
      this.installationSubtotal = this.invoiceTable.installationSubtotal;
      this.totalSupplyInstallation = this.invoiceTable.totalSupplyInstallation;
      this.utility = this.invoiceTable.utility;

      this.direction = this.invoiceTable.direction;
      this.city = this.invoiceTable.city;
      this.businessName = this.invoiceTable.businessName;
      this.cityDate = this.invoiceTable.cityDate;
      this.name = this.invoiceTable.name;
      this.construction = this.invoiceTable.construction;
      this.owesTo = this.invoiceTable.owesTo;
      this.cordially = this.invoiceTable.cordially;
      this.signature = this.invoiceTable.signature;
      this.nota = this.invoiceTable.nota;
    });
  }

  ngOnInit(): void {}

  getInvoicePDF() {
    this.pagActual = 1;
    let line = 0;
    const pdf_instance: any = new jsPDF('p');
    const title = this.invoice;
    pdf_instance.setProperties({ title, download: title });
    pdf_instance.setFont('helvetica');
    pdf_instance.deletePage(1);
    line = this.addNewPage(pdf_instance, true);
    line = this.addTitle(pdf_instance, line);
    line = this.addGroupToPDF(pdf_instance, line);
    (line = this.addEndorsement(pdf_instance, line - 3)),
      pdf_instance.output('dataurlnewwindow', title);
  }

  addNewPage(pdf_instance: any, add_header?: any) {
    let i = 13;
    pdf_instance.addPage();
    if (add_header) {
      i = this.addHeader(pdf_instance, i);
    }
    return add_header ? i : 40;
  }

  addHeader(pdf_instance: any, line: number, currentPage = this.pagActual) {
    let i = line;
    this.pagActual++;

    pdf_instance.addImage(logo, 'png', 85, 8, 40, 8);

    if (currentPage == 1) {
      i += 1;
    } else {
      i += 20;
    }

    if (currentPage == 1) {
      pdf_instance.setFontSize('8');
      pdf_instance.setFont('helvetica', 'bold');
      pdf_instance.text('servicioalcliente@latelier.com.co', 105, i + 6, {
        align: 'center'
      });
      i += 6;
      pdf_instance.text(this.direction, 105, i + 4, {
        align: 'center'
      });
      i += 4;
      pdf_instance.text('6651722', 105, i + 4, {
        align: 'center'
      });
      i += 4;
      pdf_instance.text(this.city, 105, i + 4, {
        align: 'center'
      });

      pdf_instance.text(this.businessName, 12, i);
      // i += 4;
      pdf_instance.text('Nit: 900.445.452-0', 12, i + 4);
      i += 4;
    }
    return (i += 4);
  }

  addTitle(pdf_instance: any, line: number) {
    let i = line;
    pdf_instance.setFont('helvetica', 'normal');
    pdf_instance.setFontSize('9');
    pdf_instance.text(this.cityDate, 12, i + 5);
    i += 2;
    pdf_instance.setFontSize('12');
    pdf_instance.setFont('helvetica', 'bold');

    pdf_instance.text('Sr(a): ' + this.name, 100, i + 16, { align: 'center' });
    i += 16;
    pdf_instance.setFont('helvetica', 'normal');

    pdf_instance.text('Nit: 1143361183', 100, i + 4, {
      align: 'center'
    });
    i += 4;

    pdf_instance.text(this.construction, 100, i + 4, {
      align: 'center'
    });
    i += 4;
    pdf_instance.text('Tel: 3235286101', 100, i + 4, {
      align: 'center'
    });
    i += 4;
    pdf_instance.text('Email: jeffrey_espinel@hotmail.com', 100, i + 4, {
      align: 'center'
    });
    i += 4;

    pdf_instance.setFont('helvetica', 'bold');
    pdf_instance.setFontSize('14');
    pdf_instance.text(this.owesTo, 100, i + 10, {
      align: 'center'
    });
    i += 10;

    pdf_instance.setFontSize('12');
    pdf_instance.text(this.businessName, 100, i + 10, {
      align: 'center'
    });
    i += 10;
    pdf_instance.setFont('helvetica', 'normal');
    pdf_instance.setFontSize('12');
    pdf_instance.text('900.445.452-0', 100, i + 4, {
      align: 'center'
    });
    i += 4;
    return i;
  }

  addGroupToPDF(pdf_instance: any, line: number) {
    let i = line + 5;
    let header: any;
    let subtotal: any;
    let tableData: any;

    if (this.id === 'U') {
      header = [
        [
          this.item,
          this.supplyUnitValue,
          this.supplyUnitInstallation,
          this.quantity,
          this.supplySubtotal,
          this.installationSubtotal
        ]
      ];
      tableData = [
        [
          'P1_0,60 x 2,50',
          '$ 200.183',
          '$ 200.183',
          30,
          '$ 6.005.490',
          '$ 6.005.490'
        ]
      ];
      subtotal = [
        [
          {
            content: 'Subtotal',
            colSpan: 4,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fillColor: '#C4D79B',
              textColor: '#000000'
            }
          }
        ],
        [
          {
            content: this.utility,
            colSpan: 4,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fillColor: '#C4D79B',
              textColor: '#000000'
            }
          }
        ],
        [
          {
            content: 'IVA 19%',
            colSpan: 4,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fillColor: '#C4D79B',
              textColor: '#000000'
            }
          }
        ],
        [
          {
            content: 'Total',
            colSpan: 4,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fillColor: '#C4D79B',
              textColor: '#000000'
            }
          }
        ],
        [
          {
            content: this.totalSupplyInstallation,
            colSpan: 4,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fillColor: '#C4D79B',
              textColor: '#000000'
            }
          },
          {
            content: '$ 200.183',
            colSpan: 2,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fillColor: '#C4D79B',
              textColor: '#000000'
            }
          }
        ]
      ];
    } else if (this.id === 'S') {
      header = [
        [
          this.item,
          this.mtUnit,
          this.mtSupplyUnitValue,
          this.mtSupplyUnitInstallation,
          this.quantity,
          this.supplySubtotal,
          this.installationSubtotal
        ]
      ];
      tableData = [
        [
          'P1_0,60 x 2,50',
          '1.5',
          '$ 133.455',
          '$ 133.455',
          30,
          '$ 6.005.490',
          '$ 6.005.490'
        ]
      ];
      subtotal = [
        [
          {
            content: 'Subtotal',
            colSpan: 5,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fillColor: '#C4D79B',
              textColor: '#000000'
            }
          }
        ],
        [
          {
            content: this.utility,
            colSpan: 5,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fillColor: '#C4D79B',
              textColor: '#000000'
            }
          }
        ],
        [
          {
            content: 'IVA 19%',
            colSpan: 5,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fillColor: '#C4D79B',
              textColor: '#000000'
            }
          }
        ],
        [
          {
            content: 'Total',
            colSpan: 5,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fillColor: '#C4D79B',
              textColor: '#000000'
            }
          }
        ],
        [
          {
            content: this.totalSupplyInstallation,
            colSpan: 5,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fillColor: '#C4D79B',
              textColor: '#000000'
            }
          },
          {
            content: '$ 200.183',
            colSpan: 2,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fillColor: '#C4D79B',
              textColor: '#000000'
            }
          }
        ]
      ];
    } else if (this.id === 'O') {
      header = [
        [
          this.item,
          this.mtUnit,
          this.mtSupplyUnitValue,
          this.mtSupplyUnitInstallation,
          this.supplyUnitValue,
          this.supplyUnitInstallation,
          this.quantity,
          this.supplySubtotal,
          this.installationSubtotal
        ]
      ];
      tableData = [
        [
          'P1_0,60 x 2,50',
          '1.5',
          '$ 133.455',
          '$ 133.455',
          '$ 200.183',
          '$ 200.183',
          30,
          '$ 6.005.490',
          '$ 6.005.490'
        ]
      ];
      subtotal = [
        [
          {
            content: 'Subtotal',
            colSpan: 7,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fillColor: '#C4D79B',
              textColor: '#000000'
            }
          }
        ],
        [
          {
            content: this.utility,
            colSpan: 7,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fillColor: '#C4D79B',
              textColor: '#000000'
            }
          }
        ],
        [
          {
            content: 'IVA 19%',
            colSpan: 7,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fillColor: '#C4D79B',
              textColor: '#000000'
            }
          }
        ],
        [
          {
            content: 'Total',
            colSpan: 7,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fillColor: '#C4D79B',
              textColor: '#000000'
            }
          }
        ],
        [
          {
            content: this.totalSupplyInstallation,
            colSpan: 7,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fillColor: '#C4D79B',
              textColor: '#000000'
            }
          },
          {
            content: '$ 200.183',
            colSpan: 2,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fillColor: '#C4D79B',
              textColor: '#000000'
            }
          }
        ]
      ];
    }

    pdf_instance.autoTable({
      headStyles: {
        fontStyle: 'bold',
        fillColor: '#C4D79B',
        textColor: '#000000',
        halign: 'center',
        fontSize: 6,
        valign: 'middle'
      },
      styles: { fontSize: [6] },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'right', cellWidth: 20 },
        2: { halign: 'right', cellWidth: 20 },
        3: { halign: 'right', cellWidth: 20 },
        4: { halign: 'right', cellWidth: 20 },
        5: { halign: 'right', cellWidth: 20 },
        6: { halign: 'right', cellWidth: 20 },
        7: { halign: 'right', cellWidth: 20 },
        8: { halign: 'right', cellWidth: 20 }
      },
      margin: { left: 7, right: 7 },
      theme: 'grid',
      head: header,
      body: tableData,
      startY: i
    });

    pdf_instance.autoTable({
      startY: pdf_instance.lastAutoTable.finalY + 0,
      bodyStyles: {
        fontSize: 6,
        cellWidth: 20
      },
      styles: {
        fontSize: [6]
      },
      margin: { left: 7, right: 7 },
      theme: 'grid',
      head: header,
      body: [...subtotal],
      showHead: 'never'
    }),
      (i = pdf_instance.autoTable.previous.finalY);
    return pdf_instance.autoTable.previous.finalY;
  }

  addEndorsement(pdf_instance: any, line: number) {
    let i = line;
    i = pdf_instance.autoTable.previous.finalY + 10;

    pdf_instance.setTextColor('red');
    i = this.checkPageOverflow(pdf_instance, i, 1, 14, true, 'Nota:');
    pdf_instance.text('Nota:', 12, i + 4, { halign: 'left' });

    pdf_instance.autoTable({
      theme: 'plain',
      headStyles: {
        cellPadding: { bottom: 0 }
      },
      columnStyles: { 0: { lineColor: 'black', lineWidth: 0.5 } },
      head: [['']],
      body: [[this.nota]],
      startY: i + 2
    });

    i = pdf_instance.autoTable.previous.finalY + 2;
    i += 6;
    pdf_instance.setTextColor('black');
    pdf_instance.setFont('helvetica', 'bold');
    i = this.checkPageOverflow(pdf_instance, i, 1, 14, true, 'cordially');

    pdf_instance.text(this.cordially + ',', 12, i + 4);
    i += 8;

    i = this.checkPageOverflow(pdf_instance, i, 1, 18, true, 'jaime_ifu');

    pdf_instance.text('_______________________', 12, i + 6);
    i += 8;
    pdf_instance.text('JAIME CIFUENTES', 12, i + 3);
    i += 10;
    return i;
  }

  checkPageOverflow(
    pdf_instance: any,
    line: number,
    expected_height = 0,
    expected_height_text = 0,
    marginHeg = false,
    origen = ''
  ) {
    let i = line;

    const pageHeight = pdf_instance.internal.pageSize.height;

    if (origen != '') {
      console.log(origen, 'origen');
      console.log(pageHeight, 'pageHeight');
    }

    if (
      (expected_height_text > 0 ? expected_height_text : i + expected_height) >
      (marginHeg ? pageHeight + 10 - i : 180)
    ) {
      i = this.addNewPage(pdf_instance, true);
    }
    return i;
  }
}
