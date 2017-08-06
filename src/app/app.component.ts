import {Component} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";

declare var google:any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    simulatorForm: FormGroup;

    dailyRevenue:number;
    daysPerMonth:number;
    otherMonthlyRevenue:number;
    otherAnnualRevenue:number;
    monthlyFees:number;
    annualFees:number;
    monthlyGrossSalary:number;
    annualBonus:number;
    dividendsPercentage:number;

    annualRevenueFromRegularMonthlyRevenue: number = 0;
    annualRevenueFromOtherMonthlyRevenue: number = 0;
    totalAnnualRevenue: number = 0;
    // totalAnnualInVAT: number = 0;

    totalAnnualFees: number = 0;
    // totalAnnualOutVAT: number = 0;

    annualGrossSalary: number = 0;
    employerSalaryTax: number = 0;
    employeeSalaryTax: number = 0;
    netSalary: number = 0;

    grossProfit: number = 0;
    profitTax: number = 0;
    netProfit: number = 0;

    legalReserve: number = 0;
    investment: number = 0;
    grossDividends: number = 0;
    dividendsTax: number = 0;
    netDividends: number = 0;
    paidDividends: number = 0;

    totalFreelanceShare: number = 0;
    totalCompanyShare: number = 0;
    totalStateShare: number = 0;
    stateSharePercentage: number;

    constructor(private fb: FormBuilder) {
        this.simulatorForm = fb.group({
            dailyRevenue: 500,
            daysPerMonth: 18,
            otherMonthlyRevenue: 0,
            otherAnnualRevenue: 0,
            monthlyFees: 500,
            annualFees: 2000,
            monthlyGrossSalary: 3000,
            annualBonus: 0,
            dividendsPercentage: 80
        });
        this.simulate();
    }

    simulate(): void {
        let params = this.simulatorForm.value;

        this.dailyRevenue = params.dailyRevenue;
        this.daysPerMonth = params.daysPerMonth;
        this.otherMonthlyRevenue = params.otherMonthlyRevenue;
        this.otherAnnualRevenue = params.otherAnnualRevenue;

        this.monthlyFees = params.monthlyFees;
        this.annualFees = params.annualFees;

        this.monthlyGrossSalary = params.monthlyGrossSalary;
        this.annualBonus = params.annualBonus;
        this.dividendsPercentage = params.dividendsPercentage;

        this.annualRevenueFromRegularMonthlyRevenue = params.dailyRevenue * params.daysPerMonth * 12;
        this.annualRevenueFromOtherMonthlyRevenue = params.otherMonthlyRevenue * 12;
        this.totalAnnualRevenue = this.annualRevenueFromRegularMonthlyRevenue + this.annualRevenueFromOtherMonthlyRevenue + params.otherAnnualRevenue;
        // this.totalAnnualInVAT = Math.round(this.totalAnnualRevenue * 0.2);

        this.totalAnnualFees = (params.monthlyFees * 12) + params.annualFees;
        // this.totalAnnualOutVAT = Math.round(this.totalAnnualFees * 0.2);

        this.annualGrossSalary = (params.monthlyGrossSalary * 12) + params.annualBonus;
        this.employerSalaryTax = Math.round(this.annualGrossSalary * 0.42);
        this.employeeSalaryTax = Math.round(this.annualGrossSalary * 0.22);
        this.netSalary = this.annualGrossSalary - this.employeeSalaryTax;

        this.grossProfit = this.totalAnnualRevenue - this.annualGrossSalary - this.employerSalaryTax - this.totalAnnualFees;
        this.profitTax = Math.round(Math.min(this.grossProfit, 38000) * 0.15) + Math.round(Math.max(this.grossProfit - 38000, 0) * 0.333);
        this.netProfit = this.grossProfit - this.profitTax;

        this.legalReserve = Math.round(this.netProfit * 0.05);
        this.grossDividends = this.netProfit - this.legalReserve;
        this.paidDividends = Math.round(this.grossDividends * (params.dividendsPercentage / 100));
        this.investment = this.grossDividends - this.paidDividends;
        this.dividendsTax = Math.round(this.paidDividends * 0.155);
        this.netDividends = this.paidDividends - this.dividendsTax;

        this.totalFreelanceShare = this.netSalary + this.netDividends;
        this.totalCompanyShare = this.legalReserve + this.investment;
        this.totalStateShare = this.employerSalaryTax + this.employeeSalaryTax + this.profitTax + this.dividendsTax;
        this.stateSharePercentage = Math.round(this.totalStateShare * 100 / this.totalAnnualRevenue);

        this.drawSankey();

    }

    private drawSankey() {
        google.charts.load('current', {'packages': ['sankey']});
        google.charts.setOnLoadCallback(() => {
            let data = new google.visualization.DataTable();
            data.addColumn('string', 'From');
            data.addColumn('string', 'To');
            data.addColumn('number', 'Montant');
            data.addRows([
                ['CA mensuel mission', 'CA', 10],
                ['CA mensuel  autre', 'CA', 20],
                ['CA annuel autre', 'CA', 30],
                ['CA', 'Frais', 20],
                    ['Frais', 'Achats', 4],
                    ['Frais', 'Salaire super-brut', 16],
                        ['Salaire super-brut', 'Charges patronales', 5],
                            ['Charges patronales', 'Etat', 5],
                        ['Salaire super-brut', 'Salaire brut', 11],
                            ['Salaire brut', 'Charges salariales', 2],
                                ['Charges salariales', 'Etat', 2],
                            ['Salaire brut', 'Salaire net', 9],
                                ['Salaire net', 'Freelance', 9],
                ['CA', 'Bénéfices bruts', 40],
                    ['Bénéfices bruts', 'IS', 13],
                        ['IS', 'Etat', 13],
                    ['Bénéfices bruts', 'Bénéfices nets', 27],
                        ['Bénéfices nets', 'Réserve', 2],
                            ['Réserve', 'Société', 2],
                        ['Bénéfices nets', 'Investissement', 5],
                            ['Investissement', 'Société', 5],
                        ['Bénéfices nets', 'Dividendes bruts', 20],
                            ['Dividendes bruts', 'Dividendes nets', 17],
                                ['Dividendes nets', 'Freelance', 17],
                            ['Dividendes bruts', 'Cotisations sociales', 3],
                                ['Cotisations sociales', 'Etat', 3]
            ]);

            // Sets chart options.
            let options = {
                width: 960,
                height: 400,
                sankey: {
                    iterations: 64,
                    node: {
                        nodePadding: 10,
                        width: 10
                    }
                },
            };

            // Instantiates and draws our chart, passing in some options.
            let chart = new google.visualization.Sankey(document.getElementById('sankey_basic'));
            chart.draw(data, options);

        });
    }
}
