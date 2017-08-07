import {ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, SimpleChanges} from "@angular/core";
import {Model} from "../Model";

declare var google: any;

@Component({
  selector: 'app-graph-sankey',
  templateUrl: './graph-sankey.component.html',
    styleUrls: ['./graph-sankey.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphSankeyComponent implements OnChanges {


    @Input() model: Model;

    constructor(private element: ElementRef) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        let rows = [
            ['CA total', 'Dépenses', this.model.totalAnnualSpendings],
            ['Dépenses', 'Achats', this.model.totalAnnualFees],
            ['Dépenses', 'Salaire super-brut', this.model.annualSuperGrossSalary],
            ['Salaire super-brut', 'Charges patronales', this.model.employerSalaryTax],
            ['Charges patronales', 'Etat', this.model.employerSalaryTax],
            ['Salaire super-brut', 'Salaire brut', this.model.totalAnnualGrossSalary],
            ['Salaire brut', 'Charges salariales', this.model.employeeSalaryTax],
            ['Charges salariales', 'Etat', this.model.employeeSalaryTax],
            ['Salaire brut', 'Salaire net', this.model.annualNetSalary],
            ['Salaire net', 'Freelance', this.model.annualNetSalary],
            ['CA total', 'Bénéfices bruts', this.model.grossProfit],
            ['Bénéfices bruts', 'IS', this.model.profitTax],
            ['IS', 'Etat', this.model.profitTax],
            ['Bénéfices bruts', 'Bénéfices nets', this.model.netProfit],
            ['Bénéfices nets', 'Dividendes bruts', this.model.grossDividends]
        ];
        if (this.model.annualRevenueFromRegularMonthlyRevenue) {
            rows.push(['CA journalier', 'CA total', this.model.annualRevenueFromRegularMonthlyRevenue]);
        }
        if (this.model.annualRevenueFromOtherMonthlyRevenue) {
            rows.push(['CA mensuel  autre', 'CA total', this.model.annualRevenueFromOtherMonthlyRevenue],
            );
        }
        if (this.model.otherAnnualRevenue) {
            rows.push(['CA annuel autre', 'CA total', this.model.otherAnnualRevenue],
            );
        }
        if (this.model.grossDividends) {
            rows.push(
                ['Dividendes bruts', 'Dividendes nets', this.model.netDividends],
                ['Dividendes nets', 'Freelance', this.model.netDividends],
                ['Dividendes bruts', 'Cotisations sociales', this.model.dividendsTax],
                ['Cotisations sociales', 'Etat', this.model.dividendsTax]
            );
        }
        if (this.model.investment) {
            rows.push(
                ['Bénéfices nets', 'Investissement', this.model.investment],
                ['Investissement', 'Société', this.model.investment]
            );
        }

        google.charts.load('current', {'packages': ['sankey']});
        google.charts.setOnLoadCallback(() => {
            let data = new google.visualization.DataTable();
            data.addColumn('string', 'From');
            data.addColumn('string', 'To');
            data.addColumn('number', 'Montant');
            data.addRows(rows);

            let options = {
                height: 600,
                sankey: {
                    iterations: 64,
                    node: {
                        nodePadding: 15,
                        width: 15
                    },
                    link: {
                        colorMode: 'target'
                    }
                },
            };

            let chart = new google.visualization.Sankey(this.element.nativeElement);
            chart.draw(data, options);

        });
  }

}
