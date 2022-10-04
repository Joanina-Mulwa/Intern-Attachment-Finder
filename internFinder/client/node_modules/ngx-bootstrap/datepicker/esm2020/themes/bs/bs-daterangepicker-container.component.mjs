import { Component, ElementRef, EventEmitter, Renderer2, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { getFullYear, getMonth } from 'ngx-bootstrap/chronos';
import { PositioningService } from 'ngx-bootstrap/positioning';
import { TimepickerComponent } from 'ngx-bootstrap/timepicker';
import { BsDatepickerAbstractComponent } from '../../base/bs-datepicker-container';
import { BsDatepickerConfig } from '../../bs-datepicker.config';
import { BsDatepickerActions } from '../../reducer/bs-datepicker.actions';
import { BsDatepickerEffects } from '../../reducer/bs-datepicker.effects';
import { BsDatepickerStore } from '../../reducer/bs-datepicker.store';
import { datepickerAnimation } from '../../datepicker-animations';
import { dayInMilliseconds } from '../../reducer/_defaults';
import * as i0 from "@angular/core";
import * as i1 from "../../bs-datepicker.config";
import * as i2 from "../../reducer/bs-datepicker.store";
import * as i3 from "../../reducer/bs-datepicker.actions";
import * as i4 from "../../reducer/bs-datepicker.effects";
import * as i5 from "ngx-bootstrap/positioning";
import * as i6 from "@angular/common";
import * as i7 from "ngx-bootstrap/timepicker";
import * as i8 from "./bs-custom-dates-view.component";
import * as i9 from "./bs-days-calendar-view.component";
import * as i10 from "./bs-months-calendar-view.component";
import * as i11 from "./bs-years-calendar-view.component";
export class BsDaterangepickerContainerComponent extends BsDatepickerAbstractComponent {
    constructor(_renderer, _config, _store, _element, _actions, _effects, _positionService) {
        super();
        this._config = _config;
        this._store = _store;
        this._element = _element;
        this._actions = _actions;
        this._positionService = _positionService;
        this.valueChange = new EventEmitter();
        this.animationState = 'void';
        this._rangeStack = [];
        this.chosenRange = [];
        this._subs = [];
        this.isRangePicker = true;
        this._effects = _effects;
        this.customRanges = this._config.ranges || [];
        this.customRangeBtnLbl = this._config.customRangeButtonLabel;
        _renderer.setStyle(_element.nativeElement, 'display', 'block');
        _renderer.setStyle(_element.nativeElement, 'position', 'absolute');
    }
    set value(value) {
        this._effects?.setRangeValue(value);
    }
    ngOnInit() {
        this._positionService.setOptions({
            modifiers: {
                flip: {
                    enabled: this._config.adaptivePosition
                },
                preventOverflow: {
                    enabled: this._config.adaptivePosition
                }
            },
            allowedPositions: this._config.allowedPositions
        });
        this._positionService.event$?.pipe(take(1))
            .subscribe(() => {
            this._positionService.disable();
            if (this._config.isAnimated) {
                this.animationState = this.isTopPosition ? 'animated-up' : 'animated-down';
                return;
            }
            this.animationState = 'unanimated';
        });
        this.containerClass = this._config.containerClass;
        this.isOtherMonthsActive = this._config.selectFromOtherMonth;
        this.withTimepicker = this._config.withTimepicker;
        this._effects?.init(this._store)
            // intial state options
            // todo: fix this, split configs
            .setOptions(this._config)
            // data binding view --> model
            .setBindings(this)
            // set event handlers
            .setEventHandlers(this)
            .registerDatepickerSideEffects();
        let currentDate;
        // todo: move it somewhere else
        // on selected date change
        this._subs.push(this._store
            .select(state => state.selectedRange)
            .subscribe(dateRange => {
            currentDate = dateRange;
            this.valueChange.emit(dateRange);
            this.chosenRange = dateRange || [];
        }));
        this._subs.push(this._store
            .select(state => state.selectedTime)
            .subscribe((time) => {
            if ((!time[0] || !time[1]) ||
                (!(time[0] instanceof Date) || !(time[1] instanceof Date)) ||
                (currentDate && (time[0] === currentDate[0] && time[1] === currentDate[1]))) {
                return;
            }
            this.valueChange.emit(time);
            this.chosenRange = time || [];
        }));
    }
    ngAfterViewInit() {
        this.selectedTimeSub.add(this.selectedTime?.subscribe((val) => {
            if (Array.isArray(val) && val.length >= 2) {
                this.startTimepicker?.writeValue(val[0]);
                this.endTimepicker?.writeValue(val[1]);
            }
        }));
        this.startTimepicker?.registerOnChange((val) => {
            this.timeSelectHandler(val, 0);
        });
        this.endTimepicker?.registerOnChange((val) => {
            this.timeSelectHandler(val, 1);
        });
    }
    get isTopPosition() {
        return this._element.nativeElement.classList.contains('top');
    }
    positionServiceEnable() {
        this._positionService.enable();
    }
    timeSelectHandler(date, index) {
        this._store.dispatch(this._actions.selectTime(date, index));
    }
    daySelectHandler(day) {
        if (!day) {
            return;
        }
        const isDisabled = this.isOtherMonthsActive ? day.isDisabled : (day.isOtherMonth || day.isDisabled);
        if (isDisabled) {
            return;
        }
        this.rangesProcessing(day);
    }
    monthSelectHandler(day) {
        if (!day || day.isDisabled) {
            return;
        }
        day.isSelected = true;
        if (this._config.minMode !== 'month') {
            if (day.isDisabled) {
                return;
            }
            this._store.dispatch(this._actions.navigateTo({
                unit: {
                    month: getMonth(day.date),
                    year: getFullYear(day.date)
                },
                viewMode: 'day'
            }));
            return;
        }
        this.rangesProcessing(day);
    }
    yearSelectHandler(day) {
        if (!day || day.isDisabled) {
            return;
        }
        day.isSelected = true;
        if (this._config.minMode !== 'year') {
            if (day.isDisabled) {
                return;
            }
            this._store.dispatch(this._actions.navigateTo({
                unit: {
                    year: getFullYear(day.date)
                },
                viewMode: 'month'
            }));
            return;
        }
        this.rangesProcessing(day);
    }
    rangesProcessing(day) {
        // if only one date is already selected
        // and user clicks on previous date
        // start selection from new date
        // but if new date is after initial one
        // than finish selection
        if (this._rangeStack.length === 1) {
            this._rangeStack =
                day.date >= this._rangeStack[0]
                    ? [this._rangeStack[0], day.date]
                    : [day.date];
        }
        if (this._config.maxDateRange) {
            this.setMaxDateRangeOnCalendar(day.date);
        }
        if (this._rangeStack.length === 0) {
            this._rangeStack = [day.date];
            if (this._config.maxDateRange) {
                this.setMaxDateRangeOnCalendar(day.date);
            }
        }
        this._store.dispatch(this._actions.selectRange(this._rangeStack));
        if (this._rangeStack.length === 2) {
            this._rangeStack = [];
        }
    }
    ngOnDestroy() {
        for (const sub of this._subs) {
            sub.unsubscribe();
        }
        this.selectedTimeSub.unsubscribe();
        this._effects?.destroy();
    }
    setRangeOnCalendar(dates) {
        if (dates) {
            this._rangeStack = dates.value instanceof Date ? [dates.value] : dates.value;
        }
        this._store.dispatch(this._actions.selectRange(this._rangeStack));
    }
    setMaxDateRangeOnCalendar(currentSelection) {
        let maxDateRange = new Date(currentSelection);
        if (this._config.maxDate) {
            const maxDateValueInMilliseconds = this._config.maxDate.getTime();
            const maxDateRangeInMilliseconds = currentSelection.getTime() + ((this._config.maxDateRange || 0) * dayInMilliseconds);
            maxDateRange = maxDateRangeInMilliseconds > maxDateValueInMilliseconds ?
                new Date(this._config.maxDate) :
                new Date(maxDateRangeInMilliseconds);
        }
        else {
            maxDateRange.setDate(currentSelection.getDate() + (this._config.maxDateRange || 0));
        }
        this._effects?.setMaxDate(maxDateRange);
    }
}
BsDaterangepickerContainerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.6", ngImport: i0, type: BsDaterangepickerContainerComponent, deps: [{ token: i0.Renderer2 }, { token: i1.BsDatepickerConfig }, { token: i2.BsDatepickerStore }, { token: i0.ElementRef }, { token: i3.BsDatepickerActions }, { token: i4.BsDatepickerEffects }, { token: i5.PositioningService }], target: i0.ɵɵFactoryTarget.Component });
BsDaterangepickerContainerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.6", type: BsDaterangepickerContainerComponent, selector: "bs-daterangepicker-container", host: { attributes: { "role": "dialog", "aria-label": "calendar" }, listeners: { "click": "_stopPropagation($event)" }, classAttribute: "bottom" }, providers: [BsDatepickerStore, BsDatepickerEffects], viewQueries: [{ propertyName: "startTimepicker", first: true, predicate: ["startTP"], descendants: true }, { propertyName: "endTimepicker", first: true, predicate: ["endTP"], descendants: true }], usesInheritance: true, ngImport: i0, template: "<!-- days calendar view mode -->\n<div class=\"bs-datepicker\" [ngClass]=\"containerClass\" *ngIf=\"viewMode | async\">\n  <div class=\"bs-datepicker-container\"\n    [@datepickerAnimation]=\"animationState\"\n    (@datepickerAnimation.done)=\"positionServiceEnable()\">\n    <!--calendars-->\n    <div class=\"bs-calendar-container\" [ngSwitch]=\"viewMode | async\" role=\"application\">\n      <!--days calendar-->\n      <ng-container *ngSwitchCase=\"'day'\">\n        <div class=\"bs-media-container\">\n          <bs-days-calendar-view\n            *ngFor=\"let calendar of daysCalendar$ | async\"\n            [class.bs-datepicker-multiple]=\"multipleCalendars\"\n            [calendar]=\"calendar\"\n            [options]=\"options$ | async\"\n            (onNavigate)=\"navigateTo($event)\"\n            (onViewMode)=\"setViewMode($event)\"\n            (onHover)=\"dayHoverHandler($event)\"\n            (onHoverWeek)=\"weekHoverHandler($event)\"\n            (onSelect)=\"daySelectHandler($event)\">\n          </bs-days-calendar-view>\n        </div>\n        <div *ngIf=\"withTimepicker\" class=\"bs-timepicker-in-datepicker-container\">\n          <timepicker #startTP></timepicker>\n          <timepicker #endTP *ngIf=\"isRangePicker\"></timepicker>\n        </div>\n      </ng-container>\n\n      <!--months calendar-->\n      <div *ngSwitchCase=\"'month'\" class=\"bs-media-container\">\n        <bs-month-calendar-view\n          *ngFor=\"let calendar of monthsCalendar | async\"\n          [class.bs-datepicker-multiple]=\"multipleCalendars\"\n          [calendar]=\"calendar\"\n          (onNavigate)=\"navigateTo($event)\"\n          (onViewMode)=\"setViewMode($event)\"\n          (onHover)=\"monthHoverHandler($event)\"\n          (onSelect)=\"monthSelectHandler($event)\">\n        </bs-month-calendar-view>\n      </div>\n\n      <!--years calendar-->\n      <div *ngSwitchCase=\"'year'\" class=\"bs-media-container\">\n        <bs-years-calendar-view\n          *ngFor=\"let calendar of yearsCalendar | async\"\n          [class.bs-datepicker-multiple]=\"multipleCalendars\"\n          [calendar]=\"calendar\"\n          (onNavigate)=\"navigateTo($event)\"\n          (onViewMode)=\"setViewMode($event)\"\n          (onHover)=\"yearHoverHandler($event)\"\n          (onSelect)=\"yearSelectHandler($event)\">\n        </bs-years-calendar-view>\n      </div>\n    </div>\n\n    <!--applycancel buttons-->\n    <div class=\"bs-datepicker-buttons\" *ngIf=\"false\">\n      <button class=\"btn btn-success\" type=\"button\">Apply</button>\n      <button class=\"btn btn-default\" type=\"button\">Cancel</button>\n    </div>\n\n    <div class=\"bs-datepicker-buttons\" *ngIf=\"showTodayBtn || showClearBtn\">\n      <div class=\"btn-today-wrapper\"\n           [class.today-left]=\"todayPos === 'left'\"\n           [class.today-right]=\"todayPos === 'right'\"\n           [class.today-center]=\"todayPos === 'center'\"\n           *ngIf=\"showTodayBtn\">\n        <button class=\"btn btn-success\" (click)=\"setToday()\">{{todayBtnLbl}}</button>\n      </div>\n\n        <div class=\"btn-clear-wrapper\"\n        [class.clear-left]=\"clearPos === 'left'\"\n        [class.clear-right]=\"clearPos === 'right'\"\n        [class.clear-center]=\"clearPos === 'center'\"\n        *ngIf=\"showClearBtn\">\n          <button class=\"btn btn-success\" (click)=\"clearDate()\">{{clearBtnLbl}}</button>\n        </div>\n    </div>\n\n  </div>\n\n  <!--custom dates or date ranges picker-->\n  <div class=\"bs-datepicker-custom-range\" *ngIf=\"customRanges && customRanges.length > 0\">\n    <bs-custom-date-view\n      [selectedRange]=\"chosenRange\"\n      [ranges]=\"customRanges\"\n      [customRangeLabel]=\"customRangeBtnLbl\"\n      (onSelect)=\"setRangeOnCalendar($event)\">\n    </bs-custom-date-view>\n  </div>\n</div>\n", dependencies: [{ kind: "directive", type: i6.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i6.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i6.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "component", type: i7.TimepickerComponent, selector: "timepicker", inputs: ["hourStep", "minuteStep", "secondsStep", "readonlyInput", "disabled", "mousewheel", "arrowkeys", "showSpinners", "showMeridian", "showMinutes", "showSeconds", "meridians", "min", "max", "hoursPlaceholder", "minutesPlaceholder", "secondsPlaceholder"], outputs: ["isValid", "meridianChange"] }, { kind: "component", type: i8.BsCustomDatesViewComponent, selector: "bs-custom-date-view", inputs: ["ranges", "selectedRange", "customRangeLabel"], outputs: ["onSelect"] }, { kind: "component", type: i9.BsDaysCalendarViewComponent, selector: "bs-days-calendar-view", inputs: ["calendar", "options"], outputs: ["onNavigate", "onViewMode", "onSelect", "onHover", "onHoverWeek"] }, { kind: "component", type: i10.BsMonthCalendarViewComponent, selector: "bs-month-calendar-view", inputs: ["calendar"], outputs: ["onNavigate", "onViewMode", "onSelect", "onHover"] }, { kind: "component", type: i11.BsYearsCalendarViewComponent, selector: "bs-years-calendar-view", inputs: ["calendar"], outputs: ["onNavigate", "onViewMode", "onSelect", "onHover"] }, { kind: "pipe", type: i6.AsyncPipe, name: "async" }], animations: [datepickerAnimation] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.6", ngImport: i0, type: BsDaterangepickerContainerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'bs-daterangepicker-container', providers: [BsDatepickerStore, BsDatepickerEffects], host: {
                        class: 'bottom',
                        '(click)': '_stopPropagation($event)',
                        role: 'dialog',
                        'aria-label': 'calendar'
                    }, animations: [datepickerAnimation], template: "<!-- days calendar view mode -->\n<div class=\"bs-datepicker\" [ngClass]=\"containerClass\" *ngIf=\"viewMode | async\">\n  <div class=\"bs-datepicker-container\"\n    [@datepickerAnimation]=\"animationState\"\n    (@datepickerAnimation.done)=\"positionServiceEnable()\">\n    <!--calendars-->\n    <div class=\"bs-calendar-container\" [ngSwitch]=\"viewMode | async\" role=\"application\">\n      <!--days calendar-->\n      <ng-container *ngSwitchCase=\"'day'\">\n        <div class=\"bs-media-container\">\n          <bs-days-calendar-view\n            *ngFor=\"let calendar of daysCalendar$ | async\"\n            [class.bs-datepicker-multiple]=\"multipleCalendars\"\n            [calendar]=\"calendar\"\n            [options]=\"options$ | async\"\n            (onNavigate)=\"navigateTo($event)\"\n            (onViewMode)=\"setViewMode($event)\"\n            (onHover)=\"dayHoverHandler($event)\"\n            (onHoverWeek)=\"weekHoverHandler($event)\"\n            (onSelect)=\"daySelectHandler($event)\">\n          </bs-days-calendar-view>\n        </div>\n        <div *ngIf=\"withTimepicker\" class=\"bs-timepicker-in-datepicker-container\">\n          <timepicker #startTP></timepicker>\n          <timepicker #endTP *ngIf=\"isRangePicker\"></timepicker>\n        </div>\n      </ng-container>\n\n      <!--months calendar-->\n      <div *ngSwitchCase=\"'month'\" class=\"bs-media-container\">\n        <bs-month-calendar-view\n          *ngFor=\"let calendar of monthsCalendar | async\"\n          [class.bs-datepicker-multiple]=\"multipleCalendars\"\n          [calendar]=\"calendar\"\n          (onNavigate)=\"navigateTo($event)\"\n          (onViewMode)=\"setViewMode($event)\"\n          (onHover)=\"monthHoverHandler($event)\"\n          (onSelect)=\"monthSelectHandler($event)\">\n        </bs-month-calendar-view>\n      </div>\n\n      <!--years calendar-->\n      <div *ngSwitchCase=\"'year'\" class=\"bs-media-container\">\n        <bs-years-calendar-view\n          *ngFor=\"let calendar of yearsCalendar | async\"\n          [class.bs-datepicker-multiple]=\"multipleCalendars\"\n          [calendar]=\"calendar\"\n          (onNavigate)=\"navigateTo($event)\"\n          (onViewMode)=\"setViewMode($event)\"\n          (onHover)=\"yearHoverHandler($event)\"\n          (onSelect)=\"yearSelectHandler($event)\">\n        </bs-years-calendar-view>\n      </div>\n    </div>\n\n    <!--applycancel buttons-->\n    <div class=\"bs-datepicker-buttons\" *ngIf=\"false\">\n      <button class=\"btn btn-success\" type=\"button\">Apply</button>\n      <button class=\"btn btn-default\" type=\"button\">Cancel</button>\n    </div>\n\n    <div class=\"bs-datepicker-buttons\" *ngIf=\"showTodayBtn || showClearBtn\">\n      <div class=\"btn-today-wrapper\"\n           [class.today-left]=\"todayPos === 'left'\"\n           [class.today-right]=\"todayPos === 'right'\"\n           [class.today-center]=\"todayPos === 'center'\"\n           *ngIf=\"showTodayBtn\">\n        <button class=\"btn btn-success\" (click)=\"setToday()\">{{todayBtnLbl}}</button>\n      </div>\n\n        <div class=\"btn-clear-wrapper\"\n        [class.clear-left]=\"clearPos === 'left'\"\n        [class.clear-right]=\"clearPos === 'right'\"\n        [class.clear-center]=\"clearPos === 'center'\"\n        *ngIf=\"showClearBtn\">\n          <button class=\"btn btn-success\" (click)=\"clearDate()\">{{clearBtnLbl}}</button>\n        </div>\n    </div>\n\n  </div>\n\n  <!--custom dates or date ranges picker-->\n  <div class=\"bs-datepicker-custom-range\" *ngIf=\"customRanges && customRanges.length > 0\">\n    <bs-custom-date-view\n      [selectedRange]=\"chosenRange\"\n      [ranges]=\"customRanges\"\n      [customRangeLabel]=\"customRangeBtnLbl\"\n      (onSelect)=\"setRangeOnCalendar($event)\">\n    </bs-custom-date-view>\n  </div>\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i1.BsDatepickerConfig }, { type: i2.BsDatepickerStore }, { type: i0.ElementRef }, { type: i3.BsDatepickerActions }, { type: i4.BsDatepickerEffects }, { type: i5.PositioningService }]; }, propDecorators: { startTimepicker: [{
                type: ViewChild,
                args: ['startTP']
            }], endTimepicker: [{
                type: ViewChild,
                args: ['endTP']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnMtZGF0ZXJhbmdlcGlja2VyLWNvbnRhaW5lci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZGF0ZXBpY2tlci90aGVtZXMvYnMvYnMtZGF0ZXJhbmdlcGlja2VyLWNvbnRhaW5lci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZGF0ZXBpY2tlci90aGVtZXMvYnMvYnMtZGF0ZXBpY2tlci12aWV3Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUdaLFNBQVMsRUFDVCxTQUFTLEVBQ1YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBR3RDLE9BQU8sRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDOUQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDL0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFL0QsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDbkYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFaEUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDMUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDMUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDdEUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFbEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0seUJBQXlCLENBQUM7Ozs7Ozs7Ozs7Ozs7QUFjNUQsTUFBTSxPQUFPLG1DQUFvQyxTQUFRLDZCQUE2QjtJQWtCcEYsWUFDRSxTQUFvQixFQUNaLE9BQTJCLEVBQzNCLE1BQXlCLEVBQ3pCLFFBQW9CLEVBQ3BCLFFBQTZCLEVBQ3JDLFFBQTZCLEVBQ3JCLGdCQUFvQztRQUU1QyxLQUFLLEVBQUUsQ0FBQztRQVBBLFlBQU8sR0FBUCxPQUFPLENBQW9CO1FBQzNCLFdBQU0sR0FBTixNQUFNLENBQW1CO1FBQ3pCLGFBQVEsR0FBUixRQUFRLENBQVk7UUFDcEIsYUFBUSxHQUFSLFFBQVEsQ0FBcUI7UUFFN0IscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFvQjtRQWxCOUMsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ3pDLG1CQUFjLEdBQUcsTUFBTSxDQUFDO1FBRXhCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBQ2hCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBQ2xDLFVBQUssR0FBbUIsRUFBRSxDQUFDO1FBQ2xCLGtCQUFhLEdBQUcsSUFBSSxDQUFDO1FBZTVCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBRXpCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO1FBQzlDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDO1FBRTdELFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDL0QsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBaENELElBQUksS0FBSyxDQUFDLEtBQXFDO1FBQzdDLElBQUksQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFnQ0QsUUFBUTtRQUNOLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7WUFDL0IsU0FBUyxFQUFFO2dCQUNULElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7aUJBQ3ZDO2dCQUNELGVBQWUsRUFBRTtvQkFDZixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7aUJBQ3ZDO2FBQ0Y7WUFDRCxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQjtTQUNoRCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDeEMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNkLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUVoQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO2dCQUMzQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDO2dCQUUzRSxPQUFPO2FBQ1I7WUFFRCxJQUFJLENBQUMsY0FBYyxHQUFHLFlBQVksQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztRQUNMLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7UUFDbEQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUM7UUFDN0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztRQUNsRCxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzlCLHVCQUF1QjtZQUN2QixnQ0FBZ0M7YUFDL0IsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDekIsOEJBQThCO2FBQzdCLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDbEIscUJBQXFCO2FBQ3BCLGdCQUFnQixDQUFDLElBQUksQ0FBQzthQUN0Qiw2QkFBNkIsRUFBRSxDQUFDO1FBQ25DLElBQUksV0FBK0IsQ0FBQztRQUNwQywrQkFBK0I7UUFDL0IsMEJBQTBCO1FBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUNiLElBQUksQ0FBQyxNQUFNO2FBQ1IsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQzthQUNwQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDckIsV0FBVyxHQUFHLFNBQVMsQ0FBQztZQUN4QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNqQyxJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsSUFBSSxFQUFFLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQ0wsQ0FBQztRQUVGLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUNiLElBQUksQ0FBQyxNQUFNO2FBQ1IsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQzthQUNuQyxTQUFTLENBQUMsQ0FBQyxJQUFRLEVBQUUsRUFBRTtZQUN0QixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDO2dCQUMxRCxDQUFDLFdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQzVFO2dCQUNBLE9BQU87YUFDUjtZQUVELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FDTCxDQUFDO0lBQ0osQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQzVELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtnQkFDekMsSUFBSSxDQUFDLGVBQWUsRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3hDO1FBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNKLElBQUksQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUM3QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQzNDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSSxhQUFhO1FBQ2YsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxxQkFBcUI7UUFDbkIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFUSxpQkFBaUIsQ0FBQyxJQUFVLEVBQUUsS0FBYTtRQUNsRCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRVEsZ0JBQWdCLENBQUMsR0FBaUI7UUFDekMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNSLE9BQU87U0FDUjtRQUNELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVwRyxJQUFJLFVBQVUsRUFBRTtZQUNkLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRVEsa0JBQWtCLENBQUMsR0FBMEI7UUFDcEQsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFO1lBQzFCLE9BQU87U0FDUjtRQUVELEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBRXRCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssT0FBTyxFQUFFO1lBQ3BDLElBQUksR0FBRyxDQUFDLFVBQVUsRUFBRTtnQkFDbEIsT0FBTzthQUNSO1lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO2dCQUN2QixJQUFJLEVBQUU7b0JBQ0osS0FBSyxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO29CQUN6QixJQUFJLEVBQUUsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7aUJBQzVCO2dCQUNELFFBQVEsRUFBRSxLQUFLO2FBQ2hCLENBQUMsQ0FDSCxDQUFDO1lBRUYsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFUSxpQkFBaUIsQ0FBQyxHQUEwQjtRQUNuRCxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUU7WUFDMUIsT0FBTztTQUNSO1FBRUQsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFFdEIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sS0FBSyxNQUFNLEVBQUU7WUFDbkMsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFO2dCQUNsQixPQUFPO2FBQ1I7WUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7Z0JBQ3ZCLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7aUJBQzVCO2dCQUNELFFBQVEsRUFBRSxPQUFPO2FBQ2xCLENBQUMsQ0FDSCxDQUFDO1lBRUYsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxHQUEwQjtRQUN6Qyx1Q0FBdUM7UUFDdkMsbUNBQW1DO1FBQ25DLGdDQUFnQztRQUNoQyx1Q0FBdUM7UUFDdkMsd0JBQXdCO1FBRXhCLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxXQUFXO2dCQUNkLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQzdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQztvQkFDakMsQ0FBQyxDQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25CO1FBRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTtZQUM3QixJQUFJLENBQUMseUJBQXlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzFDO1FBRUQsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDakMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUU5QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFO2dCQUM3QixJQUFJLENBQUMseUJBQXlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzFDO1NBQ0Y7UUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUVsRSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNqQyxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztTQUN2QjtJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQzVCLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNuQjtRQUNELElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRVEsa0JBQWtCLENBQUMsS0FBb0I7UUFDOUMsSUFBSSxLQUFLLEVBQUU7WUFDVCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxLQUFLLFlBQVksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztTQUM5RTtRQUNELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCx5QkFBeUIsQ0FBQyxnQkFBc0I7UUFDOUMsSUFBSSxZQUFZLEdBQUcsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUU5QyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQ3hCLE1BQU0sMEJBQTBCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbEUsTUFBTSwwQkFBMEIsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsaUJBQWlCLENBQUUsQ0FBQztZQUN4SCxZQUFZLEdBQUcsMEJBQTBCLEdBQUcsMEJBQTBCLENBQUMsQ0FBQztnQkFDdEUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1NBQ3hDO2FBQU07WUFDTCxZQUFZLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNyRjtRQUVELElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzFDLENBQUM7O2dJQWhRVSxtQ0FBbUM7b0hBQW5DLG1DQUFtQywyTUFWbkMsQ0FBQyxpQkFBaUIsRUFBRSxtQkFBbUIsQ0FBQyxzUEM5QnJELGl3SEEyRkEsZ3JERHJEYyxDQUFDLG1CQUFtQixDQUFDOzJGQUV0QixtQ0FBbUM7a0JBWi9DLFNBQVM7K0JBQ0UsOEJBQThCLGFBQzdCLENBQUMsaUJBQWlCLEVBQUUsbUJBQW1CLENBQUMsUUFFN0M7d0JBQ0osS0FBSyxFQUFFLFFBQVE7d0JBQ2YsU0FBUyxFQUFFLDBCQUEwQjt3QkFDckMsSUFBSSxFQUFFLFFBQVE7d0JBQ2QsWUFBWSxFQUFFLFVBQVU7cUJBQ3pCLGNBQ1csQ0FBQyxtQkFBbUIsQ0FBQzsrUkFpQlgsZUFBZTtzQkFBcEMsU0FBUzt1QkFBQyxTQUFTO2dCQUNBLGFBQWE7c0JBQWhDLFNBQVM7dUJBQUMsT0FBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgUmVuZGVyZXIyLFxuICBWaWV3Q2hpbGRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgZ2V0RnVsbFllYXIsIGdldE1vbnRoIH0gZnJvbSAnbmd4LWJvb3RzdHJhcC9jaHJvbm9zJztcbmltcG9ydCB7IFBvc2l0aW9uaW5nU2VydmljZSB9IGZyb20gJ25neC1ib290c3RyYXAvcG9zaXRpb25pbmcnO1xuaW1wb3J0IHsgVGltZXBpY2tlckNvbXBvbmVudCB9IGZyb20gJ25neC1ib290c3RyYXAvdGltZXBpY2tlcic7XG5cbmltcG9ydCB7IEJzRGF0ZXBpY2tlckFic3RyYWN0Q29tcG9uZW50IH0gZnJvbSAnLi4vLi4vYmFzZS9icy1kYXRlcGlja2VyLWNvbnRhaW5lcic7XG5pbXBvcnQgeyBCc0RhdGVwaWNrZXJDb25maWcgfSBmcm9tICcuLi8uLi9icy1kYXRlcGlja2VyLmNvbmZpZyc7XG5pbXBvcnQgeyBDYWxlbmRhckNlbGxWaWV3TW9kZWwsIERheVZpZXdNb2RlbCB9IGZyb20gJy4uLy4uL21vZGVscyc7XG5pbXBvcnQgeyBCc0RhdGVwaWNrZXJBY3Rpb25zIH0gZnJvbSAnLi4vLi4vcmVkdWNlci9icy1kYXRlcGlja2VyLmFjdGlvbnMnO1xuaW1wb3J0IHsgQnNEYXRlcGlja2VyRWZmZWN0cyB9IGZyb20gJy4uLy4uL3JlZHVjZXIvYnMtZGF0ZXBpY2tlci5lZmZlY3RzJztcbmltcG9ydCB7IEJzRGF0ZXBpY2tlclN0b3JlIH0gZnJvbSAnLi4vLi4vcmVkdWNlci9icy1kYXRlcGlja2VyLnN0b3JlJztcbmltcG9ydCB7IGRhdGVwaWNrZXJBbmltYXRpb24gfSBmcm9tICcuLi8uLi9kYXRlcGlja2VyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHsgQnNDdXN0b21EYXRlcyB9IGZyb20gJy4vYnMtY3VzdG9tLWRhdGVzLXZpZXcuY29tcG9uZW50JztcbmltcG9ydCB7IGRheUluTWlsbGlzZWNvbmRzIH0gZnJvbSAnLi4vLi4vcmVkdWNlci9fZGVmYXVsdHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdicy1kYXRlcmFuZ2VwaWNrZXItY29udGFpbmVyJyxcbiAgcHJvdmlkZXJzOiBbQnNEYXRlcGlja2VyU3RvcmUsIEJzRGF0ZXBpY2tlckVmZmVjdHNdLFxuICB0ZW1wbGF0ZVVybDogJy4vYnMtZGF0ZXBpY2tlci12aWV3Lmh0bWwnLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdib3R0b20nLFxuICAgICcoY2xpY2spJzogJ19zdG9wUHJvcGFnYXRpb24oJGV2ZW50KScsXG4gICAgcm9sZTogJ2RpYWxvZycsXG4gICAgJ2FyaWEtbGFiZWwnOiAnY2FsZW5kYXInXG4gIH0sXG4gIGFuaW1hdGlvbnM6IFtkYXRlcGlja2VyQW5pbWF0aW9uXVxufSlcbmV4cG9ydCBjbGFzcyBCc0RhdGVyYW5nZXBpY2tlckNvbnRhaW5lckNvbXBvbmVudCBleHRlbmRzIEJzRGF0ZXBpY2tlckFic3RyYWN0Q29tcG9uZW50XG4gIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuXG4gIHNldCB2YWx1ZSh2YWx1ZTogKERhdGV8dW5kZWZpbmVkKVtdIHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fZWZmZWN0cz8uc2V0UmFuZ2VWYWx1ZSh2YWx1ZSk7XG4gIH1cblxuICB2YWx1ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8RGF0ZVtdPigpO1xuICBhbmltYXRpb25TdGF0ZSA9ICd2b2lkJztcblxuICBfcmFuZ2VTdGFjazogRGF0ZVtdID0gW107XG4gIG92ZXJyaWRlIGNob3NlblJhbmdlOiBEYXRlW10gPSBbXTtcbiAgX3N1YnM6IFN1YnNjcmlwdGlvbltdID0gW107XG4gIG92ZXJyaWRlIGlzUmFuZ2VQaWNrZXIgPSB0cnVlO1xuXG4gIEBWaWV3Q2hpbGQoJ3N0YXJ0VFAnKSBzdGFydFRpbWVwaWNrZXI/OiBUaW1lcGlja2VyQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdlbmRUUCcpIGVuZFRpbWVwaWNrZXI/OiBUaW1lcGlja2VyQ29tcG9uZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIF9yZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgX2NvbmZpZzogQnNEYXRlcGlja2VyQ29uZmlnLFxuICAgIHByaXZhdGUgX3N0b3JlOiBCc0RhdGVwaWNrZXJTdG9yZSxcbiAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX2FjdGlvbnM6IEJzRGF0ZXBpY2tlckFjdGlvbnMsXG4gICAgX2VmZmVjdHM6IEJzRGF0ZXBpY2tlckVmZmVjdHMsXG4gICAgcHJpdmF0ZSBfcG9zaXRpb25TZXJ2aWNlOiBQb3NpdGlvbmluZ1NlcnZpY2VcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9lZmZlY3RzID0gX2VmZmVjdHM7XG5cbiAgICB0aGlzLmN1c3RvbVJhbmdlcyA9IHRoaXMuX2NvbmZpZy5yYW5nZXMgfHwgW107XG4gICAgdGhpcy5jdXN0b21SYW5nZUJ0bkxibCA9IHRoaXMuX2NvbmZpZy5jdXN0b21SYW5nZUJ1dHRvbkxhYmVsO1xuXG4gICAgX3JlbmRlcmVyLnNldFN0eWxlKF9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgX3JlbmRlcmVyLnNldFN0eWxlKF9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdwb3NpdGlvbicsICdhYnNvbHV0ZScpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5fcG9zaXRpb25TZXJ2aWNlLnNldE9wdGlvbnMoe1xuICAgICAgbW9kaWZpZXJzOiB7XG4gICAgICAgIGZsaXA6IHtcbiAgICAgICAgICBlbmFibGVkOiB0aGlzLl9jb25maWcuYWRhcHRpdmVQb3NpdGlvblxuICAgICAgICB9LFxuICAgICAgICBwcmV2ZW50T3ZlcmZsb3c6IHtcbiAgICAgICAgICBlbmFibGVkOiB0aGlzLl9jb25maWcuYWRhcHRpdmVQb3NpdGlvblxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYWxsb3dlZFBvc2l0aW9uczogdGhpcy5fY29uZmlnLmFsbG93ZWRQb3NpdGlvbnNcbiAgICB9KTtcblxuICAgIHRoaXMuX3Bvc2l0aW9uU2VydmljZS5ldmVudCQ/LnBpcGUodGFrZSgxKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9wb3NpdGlvblNlcnZpY2UuZGlzYWJsZSgpO1xuXG4gICAgICAgIGlmICh0aGlzLl9jb25maWcuaXNBbmltYXRlZCkge1xuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uU3RhdGUgPSB0aGlzLmlzVG9wUG9zaXRpb24gPyAnYW5pbWF0ZWQtdXAnIDogJ2FuaW1hdGVkLWRvd24nO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hbmltYXRpb25TdGF0ZSA9ICd1bmFuaW1hdGVkJztcbiAgICAgIH0pO1xuICAgIHRoaXMuY29udGFpbmVyQ2xhc3MgPSB0aGlzLl9jb25maWcuY29udGFpbmVyQ2xhc3M7XG4gICAgdGhpcy5pc090aGVyTW9udGhzQWN0aXZlID0gdGhpcy5fY29uZmlnLnNlbGVjdEZyb21PdGhlck1vbnRoO1xuICAgIHRoaXMud2l0aFRpbWVwaWNrZXIgPSB0aGlzLl9jb25maWcud2l0aFRpbWVwaWNrZXI7XG4gICAgdGhpcy5fZWZmZWN0cz8uaW5pdCh0aGlzLl9zdG9yZSlcbiAgICAgIC8vIGludGlhbCBzdGF0ZSBvcHRpb25zXG4gICAgICAvLyB0b2RvOiBmaXggdGhpcywgc3BsaXQgY29uZmlnc1xuICAgICAgLnNldE9wdGlvbnModGhpcy5fY29uZmlnKVxuICAgICAgLy8gZGF0YSBiaW5kaW5nIHZpZXcgLS0+IG1vZGVsXG4gICAgICAuc2V0QmluZGluZ3ModGhpcylcbiAgICAgIC8vIHNldCBldmVudCBoYW5kbGVyc1xuICAgICAgLnNldEV2ZW50SGFuZGxlcnModGhpcylcbiAgICAgIC5yZWdpc3RlckRhdGVwaWNrZXJTaWRlRWZmZWN0cygpO1xuICAgIGxldCBjdXJyZW50RGF0ZTogRGF0ZVtdIHwgdW5kZWZpbmVkO1xuICAgIC8vIHRvZG86IG1vdmUgaXQgc29tZXdoZXJlIGVsc2VcbiAgICAvLyBvbiBzZWxlY3RlZCBkYXRlIGNoYW5nZVxuICAgIHRoaXMuX3N1YnMucHVzaChcbiAgICAgIHRoaXMuX3N0b3JlXG4gICAgICAgIC5zZWxlY3Qoc3RhdGUgPT4gc3RhdGUuc2VsZWN0ZWRSYW5nZSlcbiAgICAgICAgLnN1YnNjcmliZShkYXRlUmFuZ2UgPT4ge1xuICAgICAgICAgIGN1cnJlbnREYXRlID0gZGF0ZVJhbmdlO1xuICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdChkYXRlUmFuZ2UpO1xuICAgICAgICAgIHRoaXMuY2hvc2VuUmFuZ2UgPSBkYXRlUmFuZ2UgfHwgW107XG4gICAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMuX3N1YnMucHVzaChcbiAgICAgIHRoaXMuX3N0b3JlXG4gICAgICAgIC5zZWxlY3Qoc3RhdGUgPT4gc3RhdGUuc2VsZWN0ZWRUaW1lKVxuICAgICAgICAuc3Vic2NyaWJlKCh0aW1lOmFueSkgPT4ge1xuICAgICAgICAgIGlmICgoIXRpbWVbMF0gfHwgIXRpbWVbMV0pIHx8XG4gICAgICAgICAgICAgKCEodGltZVswXSBpbnN0YW5jZW9mIERhdGUpIHx8ICEodGltZVsxXSBpbnN0YW5jZW9mIERhdGUpKSB8fFxuICAgICAgICAgICAgIChjdXJyZW50RGF0ZSAmJiAodGltZVswXSA9PT0gY3VycmVudERhdGVbMF0gJiYgdGltZVsxXSA9PT0gY3VycmVudERhdGVbMV0pKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aW1lKTtcbiAgICAgICAgICB0aGlzLmNob3NlblJhbmdlID0gdGltZSB8fCBbXTtcbiAgICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0ZWRUaW1lU3ViLmFkZCh0aGlzLnNlbGVjdGVkVGltZT8uc3Vic2NyaWJlKCh2YWwpID0+IHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkgJiYgdmFsLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgIHRoaXMuc3RhcnRUaW1lcGlja2VyPy53cml0ZVZhbHVlKHZhbFswXSk7XG4gICAgICAgIHRoaXMuZW5kVGltZXBpY2tlcj8ud3JpdGVWYWx1ZSh2YWxbMV0pO1xuICAgICAgfVxuICAgIH0pKTtcbiAgICB0aGlzLnN0YXJ0VGltZXBpY2tlcj8ucmVnaXN0ZXJPbkNoYW5nZSgodmFsKSA9PiB7XG4gICAgICB0aGlzLnRpbWVTZWxlY3RIYW5kbGVyKHZhbCwgMCk7XG4gICAgfSk7XG4gICAgdGhpcy5lbmRUaW1lcGlja2VyPy5yZWdpc3Rlck9uQ2hhbmdlKCh2YWwpID0+IHtcbiAgICAgIHRoaXMudGltZVNlbGVjdEhhbmRsZXIodmFsLCAxKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBpc1RvcFBvc2l0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b3AnKTtcbiAgfVxuXG4gIHBvc2l0aW9uU2VydmljZUVuYWJsZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9wb3NpdGlvblNlcnZpY2UuZW5hYmxlKCk7XG4gIH1cblxuICBvdmVycmlkZSB0aW1lU2VsZWN0SGFuZGxlcihkYXRlOiBEYXRlLCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5fc3RvcmUuZGlzcGF0Y2godGhpcy5fYWN0aW9ucy5zZWxlY3RUaW1lKGRhdGUsIGluZGV4KSk7XG4gIH1cblxuICBvdmVycmlkZSBkYXlTZWxlY3RIYW5kbGVyKGRheTogRGF5Vmlld01vZGVsKTogdm9pZCB7XG4gICAgaWYgKCFkYXkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaXNEaXNhYmxlZCA9IHRoaXMuaXNPdGhlck1vbnRoc0FjdGl2ZSA/IGRheS5pc0Rpc2FibGVkIDogKGRheS5pc090aGVyTW9udGggfHwgZGF5LmlzRGlzYWJsZWQpO1xuXG4gICAgaWYgKGlzRGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5yYW5nZXNQcm9jZXNzaW5nKGRheSk7XG4gIH1cblxuICBvdmVycmlkZSBtb250aFNlbGVjdEhhbmRsZXIoZGF5OiBDYWxlbmRhckNlbGxWaWV3TW9kZWwpOiB2b2lkIHtcbiAgICBpZiAoIWRheSB8fCBkYXkuaXNEaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRheS5pc1NlbGVjdGVkID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLl9jb25maWcubWluTW9kZSAhPT0gJ21vbnRoJykge1xuICAgICAgaWYgKGRheS5pc0Rpc2FibGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3N0b3JlLmRpc3BhdGNoKFxuICAgICAgICB0aGlzLl9hY3Rpb25zLm5hdmlnYXRlVG8oe1xuICAgICAgICAgIHVuaXQ6IHtcbiAgICAgICAgICAgIG1vbnRoOiBnZXRNb250aChkYXkuZGF0ZSksXG4gICAgICAgICAgICB5ZWFyOiBnZXRGdWxsWWVhcihkYXkuZGF0ZSlcbiAgICAgICAgICB9LFxuICAgICAgICAgIHZpZXdNb2RlOiAnZGF5J1xuICAgICAgICB9KVxuICAgICAgKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnJhbmdlc1Byb2Nlc3NpbmcoZGF5KTtcbiAgfVxuXG4gIG92ZXJyaWRlIHllYXJTZWxlY3RIYW5kbGVyKGRheTogQ2FsZW5kYXJDZWxsVmlld01vZGVsKTogdm9pZCB7XG4gICAgaWYgKCFkYXkgfHwgZGF5LmlzRGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkYXkuaXNTZWxlY3RlZCA9IHRydWU7XG5cbiAgICBpZiAodGhpcy5fY29uZmlnLm1pbk1vZGUgIT09ICd5ZWFyJykge1xuICAgICAgaWYgKGRheS5pc0Rpc2FibGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3N0b3JlLmRpc3BhdGNoKFxuICAgICAgICB0aGlzLl9hY3Rpb25zLm5hdmlnYXRlVG8oe1xuICAgICAgICAgIHVuaXQ6IHtcbiAgICAgICAgICAgIHllYXI6IGdldEZ1bGxZZWFyKGRheS5kYXRlKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgdmlld01vZGU6ICdtb250aCdcbiAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5yYW5nZXNQcm9jZXNzaW5nKGRheSk7XG4gIH1cblxuICByYW5nZXNQcm9jZXNzaW5nKGRheTogQ2FsZW5kYXJDZWxsVmlld01vZGVsKTogdm9pZCB7XG4gICAgLy8gaWYgb25seSBvbmUgZGF0ZSBpcyBhbHJlYWR5IHNlbGVjdGVkXG4gICAgLy8gYW5kIHVzZXIgY2xpY2tzIG9uIHByZXZpb3VzIGRhdGVcbiAgICAvLyBzdGFydCBzZWxlY3Rpb24gZnJvbSBuZXcgZGF0ZVxuICAgIC8vIGJ1dCBpZiBuZXcgZGF0ZSBpcyBhZnRlciBpbml0aWFsIG9uZVxuICAgIC8vIHRoYW4gZmluaXNoIHNlbGVjdGlvblxuXG4gICAgaWYgKHRoaXMuX3JhbmdlU3RhY2subGVuZ3RoID09PSAxKSB7XG4gICAgICB0aGlzLl9yYW5nZVN0YWNrID1cbiAgICAgICAgZGF5LmRhdGUgPj0gdGhpcy5fcmFuZ2VTdGFja1swXVxuICAgICAgICAgID8gW3RoaXMuX3JhbmdlU3RhY2tbMF0sIGRheS5kYXRlXVxuICAgICAgICAgIDogIFtkYXkuZGF0ZV07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2NvbmZpZy5tYXhEYXRlUmFuZ2UpIHtcbiAgICAgIHRoaXMuc2V0TWF4RGF0ZVJhbmdlT25DYWxlbmRhcihkYXkuZGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3JhbmdlU3RhY2subGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLl9yYW5nZVN0YWNrID0gW2RheS5kYXRlXTtcblxuICAgICAgaWYgKHRoaXMuX2NvbmZpZy5tYXhEYXRlUmFuZ2UpIHtcbiAgICAgICAgdGhpcy5zZXRNYXhEYXRlUmFuZ2VPbkNhbGVuZGFyKGRheS5kYXRlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9zdG9yZS5kaXNwYXRjaCh0aGlzLl9hY3Rpb25zLnNlbGVjdFJhbmdlKHRoaXMuX3JhbmdlU3RhY2spKTtcblxuICAgIGlmICh0aGlzLl9yYW5nZVN0YWNrLmxlbmd0aCA9PT0gMikge1xuICAgICAgdGhpcy5fcmFuZ2VTdGFjayA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGZvciAoY29uc3Qgc3ViIG9mIHRoaXMuX3N1YnMpIHtcbiAgICAgIHN1Yi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICB0aGlzLnNlbGVjdGVkVGltZVN1Yi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2VmZmVjdHM/LmRlc3Ryb3koKTtcbiAgfVxuXG4gIG92ZXJyaWRlIHNldFJhbmdlT25DYWxlbmRhcihkYXRlczogQnNDdXN0b21EYXRlcyk6IHZvaWQge1xuICAgIGlmIChkYXRlcykge1xuICAgICAgdGhpcy5fcmFuZ2VTdGFjayA9IGRhdGVzLnZhbHVlIGluc3RhbmNlb2YgRGF0ZSA/IFtkYXRlcy52YWx1ZV0gOiBkYXRlcy52YWx1ZTtcbiAgICB9XG4gICAgdGhpcy5fc3RvcmUuZGlzcGF0Y2godGhpcy5fYWN0aW9ucy5zZWxlY3RSYW5nZSh0aGlzLl9yYW5nZVN0YWNrKSk7XG4gIH1cblxuICBzZXRNYXhEYXRlUmFuZ2VPbkNhbGVuZGFyKGN1cnJlbnRTZWxlY3Rpb246IERhdGUpOiB2b2lkIHtcbiAgICBsZXQgbWF4RGF0ZVJhbmdlID0gbmV3IERhdGUoY3VycmVudFNlbGVjdGlvbik7XG5cbiAgICBpZiAodGhpcy5fY29uZmlnLm1heERhdGUpIHtcbiAgICAgIGNvbnN0IG1heERhdGVWYWx1ZUluTWlsbGlzZWNvbmRzID0gdGhpcy5fY29uZmlnLm1heERhdGUuZ2V0VGltZSgpO1xuICAgICAgY29uc3QgbWF4RGF0ZVJhbmdlSW5NaWxsaXNlY29uZHMgPSBjdXJyZW50U2VsZWN0aW9uLmdldFRpbWUoKSArICgodGhpcy5fY29uZmlnLm1heERhdGVSYW5nZSB8fCAwKSAqIGRheUluTWlsbGlzZWNvbmRzICk7XG4gICAgICBtYXhEYXRlUmFuZ2UgPSBtYXhEYXRlUmFuZ2VJbk1pbGxpc2Vjb25kcyA+IG1heERhdGVWYWx1ZUluTWlsbGlzZWNvbmRzID9cbiAgICAgICAgbmV3IERhdGUodGhpcy5fY29uZmlnLm1heERhdGUpIDpcbiAgICAgICAgbmV3IERhdGUobWF4RGF0ZVJhbmdlSW5NaWxsaXNlY29uZHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtYXhEYXRlUmFuZ2Uuc2V0RGF0ZShjdXJyZW50U2VsZWN0aW9uLmdldERhdGUoKSArICh0aGlzLl9jb25maWcubWF4RGF0ZVJhbmdlIHx8IDApKTtcbiAgICB9XG5cbiAgICB0aGlzLl9lZmZlY3RzPy5zZXRNYXhEYXRlKG1heERhdGVSYW5nZSk7XG4gIH1cbn1cbiIsIjwhLS0gZGF5cyBjYWxlbmRhciB2aWV3IG1vZGUgLS0+XG48ZGl2IGNsYXNzPVwiYnMtZGF0ZXBpY2tlclwiIFtuZ0NsYXNzXT1cImNvbnRhaW5lckNsYXNzXCIgKm5nSWY9XCJ2aWV3TW9kZSB8IGFzeW5jXCI+XG4gIDxkaXYgY2xhc3M9XCJicy1kYXRlcGlja2VyLWNvbnRhaW5lclwiXG4gICAgW0BkYXRlcGlja2VyQW5pbWF0aW9uXT1cImFuaW1hdGlvblN0YXRlXCJcbiAgICAoQGRhdGVwaWNrZXJBbmltYXRpb24uZG9uZSk9XCJwb3NpdGlvblNlcnZpY2VFbmFibGUoKVwiPlxuICAgIDwhLS1jYWxlbmRhcnMtLT5cbiAgICA8ZGl2IGNsYXNzPVwiYnMtY2FsZW5kYXItY29udGFpbmVyXCIgW25nU3dpdGNoXT1cInZpZXdNb2RlIHwgYXN5bmNcIiByb2xlPVwiYXBwbGljYXRpb25cIj5cbiAgICAgIDwhLS1kYXlzIGNhbGVuZGFyLS0+XG4gICAgICA8bmctY29udGFpbmVyICpuZ1N3aXRjaENhc2U9XCInZGF5J1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiYnMtbWVkaWEtY29udGFpbmVyXCI+XG4gICAgICAgICAgPGJzLWRheXMtY2FsZW5kYXItdmlld1xuICAgICAgICAgICAgKm5nRm9yPVwibGV0IGNhbGVuZGFyIG9mIGRheXNDYWxlbmRhciQgfCBhc3luY1wiXG4gICAgICAgICAgICBbY2xhc3MuYnMtZGF0ZXBpY2tlci1tdWx0aXBsZV09XCJtdWx0aXBsZUNhbGVuZGFyc1wiXG4gICAgICAgICAgICBbY2FsZW5kYXJdPVwiY2FsZW5kYXJcIlxuICAgICAgICAgICAgW29wdGlvbnNdPVwib3B0aW9ucyQgfCBhc3luY1wiXG4gICAgICAgICAgICAob25OYXZpZ2F0ZSk9XCJuYXZpZ2F0ZVRvKCRldmVudClcIlxuICAgICAgICAgICAgKG9uVmlld01vZGUpPVwic2V0Vmlld01vZGUoJGV2ZW50KVwiXG4gICAgICAgICAgICAob25Ib3Zlcik9XCJkYXlIb3ZlckhhbmRsZXIoJGV2ZW50KVwiXG4gICAgICAgICAgICAob25Ib3ZlcldlZWspPVwid2Vla0hvdmVySGFuZGxlcigkZXZlbnQpXCJcbiAgICAgICAgICAgIChvblNlbGVjdCk9XCJkYXlTZWxlY3RIYW5kbGVyKCRldmVudClcIj5cbiAgICAgICAgICA8L2JzLWRheXMtY2FsZW5kYXItdmlldz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgKm5nSWY9XCJ3aXRoVGltZXBpY2tlclwiIGNsYXNzPVwiYnMtdGltZXBpY2tlci1pbi1kYXRlcGlja2VyLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDx0aW1lcGlja2VyICNzdGFydFRQPjwvdGltZXBpY2tlcj5cbiAgICAgICAgICA8dGltZXBpY2tlciAjZW5kVFAgKm5nSWY9XCJpc1JhbmdlUGlja2VyXCI+PC90aW1lcGlja2VyPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuXG4gICAgICA8IS0tbW9udGhzIGNhbGVuZGFyLS0+XG4gICAgICA8ZGl2ICpuZ1N3aXRjaENhc2U9XCInbW9udGgnXCIgY2xhc3M9XCJicy1tZWRpYS1jb250YWluZXJcIj5cbiAgICAgICAgPGJzLW1vbnRoLWNhbGVuZGFyLXZpZXdcbiAgICAgICAgICAqbmdGb3I9XCJsZXQgY2FsZW5kYXIgb2YgbW9udGhzQ2FsZW5kYXIgfCBhc3luY1wiXG4gICAgICAgICAgW2NsYXNzLmJzLWRhdGVwaWNrZXItbXVsdGlwbGVdPVwibXVsdGlwbGVDYWxlbmRhcnNcIlxuICAgICAgICAgIFtjYWxlbmRhcl09XCJjYWxlbmRhclwiXG4gICAgICAgICAgKG9uTmF2aWdhdGUpPVwibmF2aWdhdGVUbygkZXZlbnQpXCJcbiAgICAgICAgICAob25WaWV3TW9kZSk9XCJzZXRWaWV3TW9kZSgkZXZlbnQpXCJcbiAgICAgICAgICAob25Ib3Zlcik9XCJtb250aEhvdmVySGFuZGxlcigkZXZlbnQpXCJcbiAgICAgICAgICAob25TZWxlY3QpPVwibW9udGhTZWxlY3RIYW5kbGVyKCRldmVudClcIj5cbiAgICAgICAgPC9icy1tb250aC1jYWxlbmRhci12aWV3PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDwhLS15ZWFycyBjYWxlbmRhci0tPlxuICAgICAgPGRpdiAqbmdTd2l0Y2hDYXNlPVwiJ3llYXInXCIgY2xhc3M9XCJicy1tZWRpYS1jb250YWluZXJcIj5cbiAgICAgICAgPGJzLXllYXJzLWNhbGVuZGFyLXZpZXdcbiAgICAgICAgICAqbmdGb3I9XCJsZXQgY2FsZW5kYXIgb2YgeWVhcnNDYWxlbmRhciB8IGFzeW5jXCJcbiAgICAgICAgICBbY2xhc3MuYnMtZGF0ZXBpY2tlci1tdWx0aXBsZV09XCJtdWx0aXBsZUNhbGVuZGFyc1wiXG4gICAgICAgICAgW2NhbGVuZGFyXT1cImNhbGVuZGFyXCJcbiAgICAgICAgICAob25OYXZpZ2F0ZSk9XCJuYXZpZ2F0ZVRvKCRldmVudClcIlxuICAgICAgICAgIChvblZpZXdNb2RlKT1cInNldFZpZXdNb2RlKCRldmVudClcIlxuICAgICAgICAgIChvbkhvdmVyKT1cInllYXJIb3ZlckhhbmRsZXIoJGV2ZW50KVwiXG4gICAgICAgICAgKG9uU2VsZWN0KT1cInllYXJTZWxlY3RIYW5kbGVyKCRldmVudClcIj5cbiAgICAgICAgPC9icy15ZWFycy1jYWxlbmRhci12aWV3PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8IS0tYXBwbHljYW5jZWwgYnV0dG9ucy0tPlxuICAgIDxkaXYgY2xhc3M9XCJicy1kYXRlcGlja2VyLWJ1dHRvbnNcIiAqbmdJZj1cImZhbHNlXCI+XG4gICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1zdWNjZXNzXCIgdHlwZT1cImJ1dHRvblwiPkFwcGx5PC9idXR0b24+XG4gICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgdHlwZT1cImJ1dHRvblwiPkNhbmNlbDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cImJzLWRhdGVwaWNrZXItYnV0dG9uc1wiICpuZ0lmPVwic2hvd1RvZGF5QnRuIHx8IHNob3dDbGVhckJ0blwiPlxuICAgICAgPGRpdiBjbGFzcz1cImJ0bi10b2RheS13cmFwcGVyXCJcbiAgICAgICAgICAgW2NsYXNzLnRvZGF5LWxlZnRdPVwidG9kYXlQb3MgPT09ICdsZWZ0J1wiXG4gICAgICAgICAgIFtjbGFzcy50b2RheS1yaWdodF09XCJ0b2RheVBvcyA9PT0gJ3JpZ2h0J1wiXG4gICAgICAgICAgIFtjbGFzcy50b2RheS1jZW50ZXJdPVwidG9kYXlQb3MgPT09ICdjZW50ZXInXCJcbiAgICAgICAgICAgKm5nSWY9XCJzaG93VG9kYXlCdG5cIj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc3VjY2Vzc1wiIChjbGljayk9XCJzZXRUb2RheSgpXCI+e3t0b2RheUJ0bkxibH19PC9idXR0b24+XG4gICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWNsZWFyLXdyYXBwZXJcIlxuICAgICAgICBbY2xhc3MuY2xlYXItbGVmdF09XCJjbGVhclBvcyA9PT0gJ2xlZnQnXCJcbiAgICAgICAgW2NsYXNzLmNsZWFyLXJpZ2h0XT1cImNsZWFyUG9zID09PSAncmlnaHQnXCJcbiAgICAgICAgW2NsYXNzLmNsZWFyLWNlbnRlcl09XCJjbGVhclBvcyA9PT0gJ2NlbnRlcidcIlxuICAgICAgICAqbmdJZj1cInNob3dDbGVhckJ0blwiPlxuICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXN1Y2Nlc3NcIiAoY2xpY2spPVwiY2xlYXJEYXRlKClcIj57e2NsZWFyQnRuTGJsfX08L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgPC9kaXY+XG5cbiAgPCEtLWN1c3RvbSBkYXRlcyBvciBkYXRlIHJhbmdlcyBwaWNrZXItLT5cbiAgPGRpdiBjbGFzcz1cImJzLWRhdGVwaWNrZXItY3VzdG9tLXJhbmdlXCIgKm5nSWY9XCJjdXN0b21SYW5nZXMgJiYgY3VzdG9tUmFuZ2VzLmxlbmd0aCA+IDBcIj5cbiAgICA8YnMtY3VzdG9tLWRhdGUtdmlld1xuICAgICAgW3NlbGVjdGVkUmFuZ2VdPVwiY2hvc2VuUmFuZ2VcIlxuICAgICAgW3Jhbmdlc109XCJjdXN0b21SYW5nZXNcIlxuICAgICAgW2N1c3RvbVJhbmdlTGFiZWxdPVwiY3VzdG9tUmFuZ2VCdG5MYmxcIlxuICAgICAgKG9uU2VsZWN0KT1cInNldFJhbmdlT25DYWxlbmRhcigkZXZlbnQpXCI+XG4gICAgPC9icy1jdXN0b20tZGF0ZS12aWV3PlxuICA8L2Rpdj5cbjwvZGl2PlxuIl19