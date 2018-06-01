import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Model } from "./Model";
import "rxjs/add/operator/debounceTime";
import { Subscription } from "rxjs/Subscription";

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

    constructor(private fb: FormBuilder) {
        this.simulatorForm = fb.group({
            dailyRevenue: 420,
            daysPerMonth: 10,
            otherMonthlyRevenue: 0,
            otherAnnualRevenue: 0,
            monthlyFees: 600,
            annualFees: 2000,
            monthlyGrossSalary: 1000,
            annualBonus: 0,
            dividendsPercentage: 100,
            familyReferenceRevenue: 45000,
            familyQuotient: 2
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
        newModel.employerSalaryTax = Math.round(newModel.totalAnnualGrossSalary * 0.42);
        newModel.employeeSalaryTax = Math.round(newModel.totalAnnualGrossSalary * 0.22);
        newModel.annualSuperGrossSalary = newModel.totalAnnualGrossSalary + newModel.employerSalaryTax;
        
        newModel.salaryRevenueTax = this.computeRevenueTax(newModel.totalAnnualGrossSalary - newModel.employeeSalaryTax + params.familyReferenceRevenue,params.familyQuotient) 
                - this.computeRevenueTax(params.familyReferenceRevenue,params.familyQuotient);
    
        newModel.annualNetSalary = newModel.totalAnnualGrossSalary - newModel.employeeSalaryTax - newModel.salaryRevenueTax;
        

        // Spendings
        newModel.totalAnnualSpendings = newModel.totalAnnualFees + newModel.annualSuperGrossSalary;

        // Profit
        newModel.grossProfit = newModel.totalAnnualRevenue - newModel.totalAnnualSpendings;
        newModel.profitTax = Math.max(0, Math.round(Math.min(newModel.grossProfit, 38120) * 0.15) 
                            + Math.round(Math.max(newModel.grossProfit - 38120, 0) * 0.28))
                            + Math.round(Math.max(newModel.grossProfit - 500000, 0) * 0.3333);
        newModel.netProfit = newModel.grossProfit - newModel.profitTax;

        // Dividends
        newModel.dividendsPercentage = params.dividendsPercentage;
        newModel.grossDividends = Math.max(0, Math.round(newModel.netProfit * newModel.dividendsPercentage / 100));
        newModel.dividendsTax = Math.round(newModel.grossDividends * 0.30);
        newModel.netDividends = newModel.grossDividends - newModel.dividendsTax;
        newModel.investment = newModel.netProfit - newModel.grossDividends;

        // Shares
        newModel.totalFreelanceShare = newModel.annualNetSalary + newModel.netDividends;
        newModel.totalCompanyShare = newModel.investment;
        newModel.totalStateShare = newModel.employerSalaryTax + newModel.employeeSalaryTax + newModel.profitTax + newModel.dividendsTax + newModel.salaryRevenueTax;

        this.model = newModel;
    }

    computeRevenueTax(referenceRevenue: number, quotient: number): number {
        
        const baseRevenue = referenceRevenue / quotient;

        const tax = Math.min(27086, Math.max(baseRevenue - 9808, 0)) * 0.14
        + Math.min(72617, Math.max(baseRevenue - 27087, 0)) * 0.30
        + Math.min(153783, Math.max(baseRevenue - 72618, 0)) * 0.41
        + Math.max(baseRevenue - 153783, 0) * 0.45;

        return Math.round(tax * quotient);
    }

}
