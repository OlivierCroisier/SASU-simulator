import {Component, OnDestroy, OnInit} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Model} from "./Model";
import 'rxjs/add/operator/debounceTime';
import {Subscription} from "rxjs/Subscription";
import {modelGroupProvider} from "@angular/forms/src/directives/ng_model_group";


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

    simulatorForm: FormGroup;
    model: Model;
    subscription: Subscription;

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
        this.subscription = this.simulatorForm.valueChanges.debounceTime(200).subscribe(() => this.simulate());
        this.simulate();
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
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
        newModel.employerSalaryTax = Math.round(newModel.totalAnnualGrossSalary * 0.42);
        newModel.employeeSalaryTax = Math.round(newModel.totalAnnualGrossSalary * 0.22);
        newModel.annualSuperGrossSalary = newModel.totalAnnualGrossSalary + newModel.employerSalaryTax;
        newModel.annualNetSalary = newModel.totalAnnualGrossSalary - newModel.employeeSalaryTax;

        // Spendings
        newModel.totalAnnualSpendings = newModel.totalAnnualFees + newModel.annualSuperGrossSalary;

        // Profit
        newModel.grossProfit = newModel.totalAnnualRevenue - newModel.totalAnnualSpendings;
        newModel.profitTax = Math.round(Math.min(newModel.grossProfit, 38000) * 0.15) + Math.round(Math.max(newModel.grossProfit - 38000, 0) * 0.333);
        newModel.netProfit = newModel.grossProfit - newModel.profitTax;

        // Dividends
        newModel.dividendsPercentage = params.dividendsPercentage;
        newModel.grossDividends = Math.round(newModel.netProfit * newModel.dividendsPercentage / 100);
        newModel.dividendsTax = Math.round(newModel.grossDividends * 0.155);
        newModel.netDividends = newModel.grossDividends - newModel.dividendsTax;
        newModel.investment = newModel.netProfit - newModel.grossDividends;

        // Shares
        newModel.totalFreelanceShare = newModel.annualNetSalary + newModel.netDividends;
        newModel.totalCompanyShare = newModel.investment;
        newModel.totalStateShare = newModel.employerSalaryTax + newModel.employeeSalaryTax + newModel.profitTax + newModel.dividendsTax;

        this.model = newModel;
    }

}
