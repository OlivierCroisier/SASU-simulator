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
            ['CA journalier', 'CA total', this.model.annualRevenueFromRegularMonthlyRevenue],
            ['CA mensuel  autre', 'CA total', this.model.annualRevenueFromOtherMonthlyRevenue],
            ['CA annuel autre', 'CA total', this.model.otherAnnualRevenue],
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
            ['IS', 'Etat', this.model.profitTax],
                ['CA total', 'Bénéfices bruts', this.model.grossProfit],
                    ['Bénéfices bruts', 'IS', this.model.profitTax],
                    ['Bénéfices bruts', 'Bénéfices nets', this.model.netProfit],
                        ['Bénéfices nets', 'Investissement', this.model.investment],
                            ['Investissement', 'Société', this.model.investment],
                        ['Bénéfices nets', 'Dividendes bruts', this.model.grossDividends],
                            ['Dividendes bruts', 'Dividendes nets', this.model.netDividends],
                                ['Dividendes nets', 'Freelance', this.model.netDividends],
                            ['Dividendes bruts', 'Cotisations sociales', this.model.dividendsTax],
                                ['Cotisations sociales', 'Etat', this.model.dividendsTax]
        ].filter(r => r[2]);
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
                        colorMode: 'gradient'
                    }
                },
            };

            let chart = new google.visualization.Sankey(this.element.nativeElement);
            chart.draw(data, options);

        });
  }

}
