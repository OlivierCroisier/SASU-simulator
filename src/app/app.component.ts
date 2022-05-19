import {AfterViewInit, Component, OnDestroy, OnInit} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Model} from "./Model";
import "rxjs/add/operator/debounceTime";
import {Subscription} from "rxjs/Subscription";

declare var $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

    simulatorForm: FormGroup;
    model: Model;
    subscription: Subscription;
    rates: {
      employeeSalaryTax: 0.22,
      employerSalaryTax: 0.42,
      dividendsTax: {
        flatTax: 0.30,
        socialContributions: 0.172 /* CSG/CRDS with 0.172 rate and include gross profit with 40% of tax allowance for IR. */
      }
      profitTax: { /* For companies with revenue lower than 7.63m€ */
        range1: {
          rate: 0.15,
          min: 0,
          max: 38120
        },
        range2: {
          rate: 0.25,
          min: 38120,
          max: Number.MAX_VALUE
        }
      }
    }

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
    }

    ngOnInit() {
        this.subscription = this.simulatorForm.valueChanges.debounceTime(50).subscribe(() => this.simulate());
        this.simulate();
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    ngAfterViewInit(): void {
        $(".ui.accordion").accordion();
        // $(".tooltip").popup();
    }

    simulate(): void {

        let newModel: Model = new Model();

        let params = this.simulatorForm.value;

        // Revenues
        newModel.dailyRevenue = params.dailyRevenue;
        newModel.daysPerMonth = params.daysPerMonth;
        newModel.annualRevenueFromRegularMonthlyRevenue = params.dailyRevenue * params.daysPerMonth * 12;
        newModel.otherMonthlyRevenue = params.otherMonthlyRevenue;
        newModel.annualRevenueFromOtherMonthlyRevenue = params.otherMonthlyRevenue * 12;
        newModel.otherAnnualRevenue = params.otherAnnualRevenue;
        newModel.totalAnnualRevenue = newModel.annualRevenueFromRegularMonthlyRevenue + newModel.annualRevenueFromOtherMonthlyRevenue + params.otherAnnualRevenue;

        // Fees
        newModel.monthlyFees = params.monthlyFees;
        newModel.annualFeesFromMonthlyFees = params.monthlyFees * 12;
        newModel.annualFees = params.annualFees;
        newModel.totalAnnualFees = (params.monthlyFees * 12) + params.annualFees;

        // Salary
        newModel.monthlyGrossSalary = params.monthlyGrossSalary;
        newModel.annualGrossSalary = (params.monthlyGrossSalary * 12);
        newModel.annualGrossBonus = params.annualBonus;
        newModel.totalAnnualGrossSalary = newModel.annualGrossSalary + newModel.annualGrossBonus;
        newModel.employerSalaryTax = Math.round(newModel.totalAnnualGrossSalary * this.rates.employerSalaryTax);
        newModel.employeeSalaryTax = Math.round(newModel.totalAnnualGrossSalary * this.rates.employeeSalaryTax);
        newModel.annualSuperGrossSalary = newModel.totalAnnualGrossSalary + newModel.employerSalaryTax;
        newModel.annualNetSalary = newModel.totalAnnualGrossSalary - newModel.employeeSalaryTax;

        // Spendings
        newModel.totalAnnualSpendings = newModel.totalAnnualFees + newModel.annualSuperGrossSalary;

        // Profit
        const {
          profitTax: {
            range1, range2
          }
        } = this.rates;
        newModel.grossProfit = newModel.totalAnnualRevenue - newModel.totalAnnualSpendings;
        newModel.profitTax = Math.max(0, Math.round(Math.min(newModel.grossProfit, range1.max) * range1.rate) + Math.round(Math.max(newModel.grossProfit - range1.max, 0) * range2.rate));
        newModel.netProfit = newModel.grossProfit - newModel.profitTax;

        // Dividends
        newModel.dividendsPercentage = params.dividendsPercentage;
        newModel.grossDividends = Math.max(0, Math.round(newModel.netProfit * newModel.dividendsPercentage / 100));
        newModel.dividendsTax = Math.round(newModel.grossDividends * this.rates.dividendsTax.flatTax);
        newModel.netDividends = newModel.grossDividends - newModel.dividendsTax;
        newModel.investment = newModel.netProfit - newModel.grossDividends;

        // Shares
        newModel.totalFreelanceShare = newModel.annualNetSalary + newModel.netDividends;
        newModel.totalCompanyShare = newModel.investment;
        newModel.totalStateShare = newModel.employerSalaryTax + newModel.employeeSalaryTax + newModel.profitTax + newModel.dividendsTax;

        this.model = newModel;
    }

}
