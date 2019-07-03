import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';

import * as Utils from '../../../utils/util';
import * as ValidatorsFunctions from '../validators';
import { expectPropertiesValues, expectSettersMethod } from '../../../util-test/util-expect.spec';

import { PoComboBaseComponent, poComboLiteralsDefault } from './po-combo-base.component';
import { PoComboFilter } from './interfaces/po-combo-filter.interface';
import { PoComboFilterMode } from './po-combo-filter-mode.enum';
import { PoComboOption } from './interfaces/po-combo-option.interface';

class PoComboTest extends PoComboBaseComponent {

  getInputValue(): string { return ''; }

  setInputValue(value: string): void { }

  applyFilter(value: string): void { }

  getObjectByValue(value: string): void { }

  initInputObservable(): void { }

}

describe('PoComboBaseComponent:', () => {
  let component: PoComboTest;

  beforeEach(() => {
    component = new PoComboTest();
  });

  it('should be created', () => {
    component.ngOnInit();
    component.registerOnChange(() => {});
    component.registerOnTouched(() => {});
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {

    const trueValues = [true, 'true', 1, '', [], {}];
    const falseValues = [false, 'false', 0, null, undefined, NaN];

    it('p-required: should be update with valid and invalid values and call validateModel with selectedValue.', () => {
      spyOn(component, <any>'validateModel');

      expectPropertiesValues(component, 'required', trueValues, true);
      expectPropertiesValues(component, 'required', falseValues, false);

      expect(component['validateModel']).toHaveBeenCalledWith(component.selectedValue);
    });

    it('p-disabled: should be update with valid and invalid values and call validateModel with selectedValue.', () => {
      spyOn(component, <any>'validateModel');

      expectPropertiesValues(component, 'disabled', trueValues, true);
      expectPropertiesValues(component, 'disabled', falseValues, false);

      expect(component['validateModel']).toHaveBeenCalledWith(component.selectedValue);
    });

    it('p-filter-params: should not set filterParams with invalid values and should set default undefined', () => {
      const invalidValues = [ undefined, null, NaN, '' ];
      const expectedValue = undefined;

      expectPropertiesValues(component, 'filterParams', invalidValues, expectedValue);
    });

    it('p-filter-params: should set filterParams with valid values', () => {
      const validValues = [ false, true, 'filter', [], 0, {} ];

      expectPropertiesValues(component, 'filterParams', validValues, validValues);
    });

    it('p-options: should set property with `[]` if invalid values', () => {
      const invalidValues = [ undefined, null, NaN, '' ];
      const expectedValue = [];

      expectPropertiesValues(component, 'options', invalidValues, expectedValue);
    });

    it('p-options: should set property with valid values if invalid values', () => {
      const validValues = [ [{ label: '1', value: '1' }], [] ];

      expectPropertiesValues(component, 'options', validValues, validValues);
    });

    it('p-options: should set options and set cacheStaticOptions', () => {
      component['options'] = [{ label: '1', value: '1' }];

      expect(component.options.length).toBe(1);
      expect(component['cacheStaticOptions']).toEqual(component['options']);
    });

    it('p-options: should set options and call `validAndSortOptions`, `removeDuplicatedOptions` and `updateComboList`', () => {
      const options = [{ label: '1', value: '1'}];

      const spyValidAndSortOptions = spyOn(component, 'validAndSortOptions');
      const spyRemoveDuplicatedOptions = spyOn(Utils, 'removeDuplicatedOptions');
      const spyUpdateComboList = spyOn(component, 'updateComboList');

      component['options'] = options;

      expect(component.options).toEqual(options);
      expect(spyUpdateComboList).toHaveBeenCalled();
      expect(spyRemoveDuplicatedOptions).toHaveBeenCalled();
      expect(spyValidAndSortOptions).toHaveBeenCalled();
    });

    describe('p-literals:', () => {

      it('should be set `literals` with browser language if `literals` is `undefined`', () => {
        component.literals = undefined;

        expect(component.literals).toEqual(poComboLiteralsDefault[Utils.browserLanguage()]);
      });

      it('should be in portuguese if browser is set with `pt`.', () => {
        spyOn(Utils, <any> 'browserLanguage').and.returnValue('pt');

        component.literals = {};

        expect(component.literals).toEqual(poComboLiteralsDefault[Utils.poLocaleDefault]);
      });

      it('should be in english if browser is set with `en`.', () => {
        spyOn(Utils, <any> 'browserLanguage').and.returnValue('en');

        component.literals = {};

        expect(component.literals).toEqual(poComboLiteralsDefault.en);
      });

      it('should be in spanish if browser is set with `es`.', () => {
        spyOn(Utils, <any> 'browserLanguage').and.returnValue('es');

        component.literals = {};

        expect(component.literals).toEqual(poComboLiteralsDefault.es);
      });

      it('should accept custom literals.', () => {
        spyOn(Utils, <any>'browserLanguage').and.returnValue(Utils.poLocaleDefault);

        const customLiterals = Object.assign({}, poComboLiteralsDefault[Utils.poLocaleDefault]);
        customLiterals.noData = 'Sem dados';
        component.literals = customLiterals;

        expect(component.literals).toEqual(customLiterals);
      });

    });

  });

  it('should set sort', () => {
    expectSettersMethod(component, 'setSort', '', 'sort', true);
    expectSettersMethod(component, 'setSort', 'true', 'sort', true);
    expectSettersMethod(component, 'setSort', 'false', 'sort', false);
  });

  it('should update property p-filter-mode', () => {
    expectSettersMethod(component, 'filterMode', '', 'filterMode', PoComboFilterMode.startsWith);
    expectSettersMethod(component, 'filterMode', 'startsWith', 'filterMode', PoComboFilterMode.startsWith);
    expectSettersMethod(component, 'filterMode', 'contains', 'filterMode', PoComboFilterMode.contains);
    expectSettersMethod(component, 'filterMode', 'endsWith', 'filterMode', PoComboFilterMode.endsWith);
    expectSettersMethod(component, 'filterMode', PoComboFilterMode.startsWith, 'filterMode', PoComboFilterMode.startsWith);
    expectSettersMethod(component, 'filterMode', PoComboFilterMode.contains, 'filterMode', PoComboFilterMode.contains);
    expectSettersMethod(component, 'filterMode', PoComboFilterMode.endsWith, 'filterMode', PoComboFilterMode.endsWith);
  });

  it('should update property `p-disabled-init-filter` with false when invalid values', () => {
    const invalidValues = [undefined, null, 2, 'string'];

    expectPropertiesValues(component, 'disabledInitFilter', invalidValues, false);
  });

  it('should update property `p-disabled-init-filter` with valid values', () => {
    const validValues = [true, 'true', 1, ''];

    expectPropertiesValues(component, 'disabledInitFilter', validValues, true);
  });

  it('should update property `p-filter-minlength` with 0 when invalid values', () => {
    const invalidValues = [undefined, null, 'string'];

    expectPropertiesValues(component, 'filterMinlength', invalidValues, 0);
  });

  it('should update property `p-filter-minlength` with valid values', () => {
    const validValues = [5, '10'];

    expectPropertiesValues(component, 'filterMinlength', validValues, [5, 10]);
  });

  it('should return options with 5 object', () => {
    const fakeThis = {
      options: [
        {value: 'valor'},
        {label: 'label'},
        {label: 'label', value: 'valor'},
        {label: 'label', value: true},
        {label: 'label', value: false},
        {label: 'label', value: 0},
      ],
      sort: true,
      compareOptions: component.compareOptions,
      sortOptions: component.sortOptions
    };

    component.validAndSortOptions.call(fakeThis);
    expect(fakeThis.options.length).toBe(5);
  });

  it('should return options with 0 object', () => {
    const fakeThis = {
      options: Array(),
      sort: true,
      compareOptions: component.compareOptions,
      sortOptions: component.sortOptions
    };

    component.validAndSortOptions.call(fakeThis);
    expect(fakeThis.options.length).toBe(0);
  });

  it('should sort options', () => {
    component.sort = true;
    component.options = [
      {label: '2', value: 'valor 2'},
      {label: 'B', value: 'valor B'},
      {label: 'a', value: 'valor a'},
      {label: 'c', value: 'valor c'},
      {label: '1', value: 'valor 1'}
    ];
    component.sortOptions();

    expect(component.options[0].label).toBe('1');
    expect(component.options[1].label).toBe('2');
    expect(component.options[2].label).toBe('a');
    expect(component.options[3].label).toBe('B');
    expect(component.options[4].label).toBe('c');
  });

  it('should compare options', () => {
    expect(component.compareOptions({label: 'a'}, {label: 'b'})).toBe(-1);
    expect(component.compareOptions({label: 'c'}, {label: 'b'})).toBe(1);
    expect(component.compareOptions({label: 'c'}, {label: 'c'})).toBe(0);
    expect(component.compareOptions({label: 'A'}, {label: 'b'})).toBe(-1);
    expect(component.compareOptions({label: 'a'}, {label: 'C'})).toBe(-1);
  });

  it('should register onModelChange', () => {
    const fakeThis = {
      onModelChange: ''
    };
    component.registerOnChange.call(fakeThis, () => {});
    expect(typeof fakeThis.onModelChange).toBe('function');
  });

  it('should register onModelTouched', () => {
    const fakeThis = {
      onModelTouched: ''
    };
    component.registerOnTouched.call(fakeThis, () => {});
    expect(typeof fakeThis.onModelTouched).toBe('function');
  });

  it('should call the "startsWith" method', () => {
    spyOn(component, 'startsWith');
    component.compareMethod('1', null, PoComboFilterMode.startsWith);
    expect(component.startsWith).toHaveBeenCalledWith('1', null);
  });

  it('should call the "contains" method', () => {
    spyOn(component, 'contains');
    component.compareMethod('1', null, PoComboFilterMode.contains);
    expect(component.contains).toHaveBeenCalledWith('1', null);
  });

  it('should call the "endsWith" method', () => {
    spyOn(component, 'endsWith');
    component.compareMethod('1', null, PoComboFilterMode.endsWith);
    expect(component.endsWith).toHaveBeenCalledWith('1', null);
  });

  it('should compare the start of the text', () => {
    expect(component.startsWith('valor', {value: '1', label: 'valor'})).toBeTruthy();
    expect(component.startsWith('val', {value: '1', label: 'valor'})).toBeTruthy();
    expect(component.startsWith('valor', {value: '1', label: 'val'})).toBeFalsy();
  });

  it('should compare the content of the text', () => {
    expect(component.contains('valor', {value: '1', label: 'valor'})).toBeTruthy();
    expect(component.contains('val', {value: '1', label: 'valor'})).toBeTruthy();
    expect(component.contains('al', {value: '1', label: 'valor'})).toBeTruthy();
    expect(component.contains('or', {value: '1', label: 'valor'})).toBeTruthy();
    expect(component.contains('lor', {value: '1', label: 'val'})).toBeFalsy();
  });

  it('should compare the end of the text', () => {
    expect(component.endsWith('valor', {value: '1', label: 'valor'})).toBeTruthy();
    expect(component.endsWith('or', {value: '1', label: 'valor'})).toBeTruthy();
    expect(component.endsWith('val', {value: '1', label: 'valor'})).toBeFalsy();
    expect(component.endsWith('valor', {value: '1', label: 'val'})).toBeFalsy();
  });

  it('should find some option from value ', () => {
    const options: Array<PoComboOption> = [
      {label: '1', value: '1'},
      {label: 'label 2', value: '2'},
      {label: '3', value: '3'}
    ];
    expect(component.getOptionFromValue('2', options).label).toBe('label 2');
  });

  it('should return null when object list is null', () => {
    expect(component.getOptionFromValue('2', null)).toBeNull();
  });

  it('should find some option from label ', () => {
    const options: Array<PoComboOption> = [
      {label: '1', value: '1'},
      {label: 'label 2', value: '2'},
      {label: '3', value: '3'}
    ];
    expect(component.getOptionFromLabel('label 2', options).value).toBe('2');
  });

  it('should find no option', () => {
    expect(component.getOptionFromLabel('label 2', null)).toBeNull();
  });

  it('updateSelectedValue: should update the values according with option', () => {
    spyOn(component, 'callModelChange');
    spyOn(component, 'setInputValue');

    component.updateSelectedValue({label: 'label', value: 'value'});

    expect(component.selectedView).not.toBeNull();
    expect(component.selectedValue).toBe('value');
    expect(component.callModelChange).toHaveBeenCalledWith('value');
    expect(component.setInputValue).toHaveBeenCalledWith('label');
  });

  it('should call onModelChange if it exists', () => {
    const fakeThis = {
      onModelChange: (v: any) => {}
    };

    spyOn(fakeThis, 'onModelChange');
    component.callModelChange.call(fakeThis, 'value');
    expect(fakeThis.onModelChange).toHaveBeenCalledWith('value');
  });

  it('should emit ngModelChange if onModelChange not exists', () => {
    const fakeThis = {
      onModelChange: '',
      ngModelChange: {
        emit: (v: any) => {}
      }
    };

    spyOn(fakeThis.ngModelChange, 'emit');
    component.callModelChange.call(fakeThis, 'value');
    expect(fakeThis.ngModelChange.emit).toHaveBeenCalledWith('value');
  });

  it('should compare valor of different types', () => {
    expect(component.isEqual(null, 'null')).toBeTruthy();
    expect(component.isEqual(null, null)).toBeTruthy();
    expect(component.isEqual('value', 'value')).toBeTruthy();
    expect(component.isEqual(1, '1')).toBeTruthy();
    expect(component.isEqual(undefined, 'value')).toBeFalsy();
  });

  it('should search for label and update the combo list', () => {
    const options: Array<PoComboOption> = [
      {label: 'Valor 1', value: '1'},
      {label: '2', value: '2'},
      {label: 'Valor 3', value: '3'}
    ];

    component.searchForLabel('valor', options, PoComboFilterMode.startsWith);
    expect(component.visibleOptions.length).toBe(2);
  });

  it('should return the initial options list', () => {
    const options: Array<PoComboOption> = [];

    component.options = [
      {label: 'Valor 1', value: '1'},
      {label: '2', value: '2'},
      {label: 'Valor 3', value: '3'}
    ];

    component.searchForLabel('valor', options, PoComboFilterMode.startsWith);
    expect(component.visibleOptions.length).toBe(3);
  });

  it('should update the visible list', () => {
    const options: Array<PoComboOption> = [
      {label: 'Valor 1', value: '1'},
      {label: '2', value: '2'},
      {label: 'Valor 3', value: '3'}
    ];
    component.selectedView = {label: 'Valor 1', value: '1'};

    component.updateComboList(options);
    expect(component.visibleOptions.length).toBe(3);
  });

  it('should select a new item if no one are selected', () => {
    const options: Array<PoComboOption> = [
      {label: 'Valor 1', value: '1'},
      {label: '2', value: '2'},
      {label: 'Valor 3', value: '3'}
    ];
    component.selectedView = null;

    component.updateComboList(options);
    expect(component.visibleOptions.length).toBe(3);
  });

  it('should return the next item in a list', () => {
    const options: Array<PoComboOption> = [
      {label: '1', value: '1'},
      {label: '2', value: '2'},
      {label: '3', value: '3'}
    ];

    // Ordem Ascendente
    expect(component.getNextOption('1', options).value).toBe('2');
    expect(component.getNextOption('3', options).value).toBe('1');

    // Ordem Descendente
    expect(component.getNextOption('1', options, true).value).toBe('3');
    expect(component.getNextOption('3', options, true).value).toBe('2');
  });

  it('should get a index of the selected item', () => {
    component.visibleOptions = [
      {label: 'Valor 1', value: '1'},
      {label: '2', value: '2'},
      {label: 'Valor 3', value: '3'}
    ];
    component.selectedView = {label: '2', value: '2'};
    expect(component.getIndexSelectedView()).toBe(1);

    component.selectedView = {label: '4', value: '4'};
    expect(component.getIndexSelectedView()).toBeNull();
  });

  it('should compare objects', () => {
    const obj1 = { value: 'value', label: 'label'};
    const obj2 = { value: 'value', label: 'label'};
    expect(component.compareObjects(obj1, obj2)).toBeTruthy();
  });

  it('should unsubscribe keyupObservable', () => {
    component.keyupSubscribe = getFakeService('').subscribe();

    spyOn(component.keyupSubscribe, 'unsubscribe');

    component['unsubscribeKeyupObservable']();

    expect(component.keyupSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it(`writeValue: should call 'updateSelectedValue' with null and 'updateComboList'
    and not call 'getOptionFromValue' and 'getObjectByValue'`, () => {
    spyOn(component, 'getOptionFromValue');
    spyOn(component, 'getObjectByValue');
    spyOn(component, 'updateSelectedValue');
    spyOn(component, 'updateComboList');

    component.writeValue(null);

    expect(component.getOptionFromValue).not.toHaveBeenCalled();
    expect(component.getObjectByValue).not.toHaveBeenCalled();
    expect(component.updateSelectedValue).toHaveBeenCalledWith(null, true, true);
    expect(component.updateComboList).toHaveBeenCalled();
  });

  it('writeValue: should call `updateSelectedValue` when contains `options` and param is a `validValue`', () => {
    component.options = [{label: '1', value: 'valor 1'}];

    spyOn(component, 'updateSelectedValue');
    spyOn(component, 'getOptionFromValue');
    spyOn(component, 'getObjectByValue');

    component.writeValue('1');

    expect(component.updateSelectedValue).toHaveBeenCalled();
    expect(component.getOptionFromValue).toHaveBeenCalled();
    expect(component.getObjectByValue).not.toHaveBeenCalled();
  });

  it('writeValue: should call `updateSelectedValue` if `changeOnEnter` is `false`', () => {
    component.options = [{label: '1', value: 'valor 1'}];
    component.changeOnEnter = false;

    spyOn(component, 'updateSelectedValue');

    component.writeValue('1');

    expect(component.updateSelectedValue).toHaveBeenCalled();
  });

  describe('Methods:', () => {

    it('updateModel: should call `callModelChange` and `change.emit` and set `selectedValue` with value param', () => {
      const value = 1;

      component.selectedValue = undefined;

      spyOn(component, 'callModelChange');
      spyOn(component.change, 'emit');

      component['updateModel'](value);

      expect(component.callModelChange).toHaveBeenCalledWith(value);
      expect(component.change.emit).toHaveBeenCalledWith(value);
      expect(component.selectedValue).toBe(value);
    });

    it('updateModel: shouldn`t call `callModelChange` and `change.emit` if `selectedValue` is equal value param', () => {
      const value = 1;

      component.selectedValue = value;

      const spyCallModelChange = spyOn(component, 'callModelChange');
      const spyChangeEmit = spyOn(component.change, 'emit');

      component['updateModel'](value);

      expect(spyCallModelChange).not.toHaveBeenCalled();
      expect(spyChangeEmit).not.toHaveBeenCalled();

      expect(component.selectedValue).toBe(value);
    });

    it('updateModel: shouldn`t call `callModelChange` and should call `change.emit` if `fromWriteValue` is true', () => {
      const value = 1;

      component.selectedValue = undefined;

      const spyCallModelChange = spyOn(component, 'callModelChange');
      const spyChangeEmit = spyOn(component.change, 'emit');

      component['updateModel'](value, true);

      expect(spyCallModelChange).not.toHaveBeenCalled();
      expect(spyChangeEmit).toHaveBeenCalled();

      expect(component.selectedValue).toBe(value);
    });

    it(`updateSelectedValueWithOldOption: should call 'updateSelectedValue' passing oldOption found and 'true' when
      'onModelChange' is undefined`, () => {
      const oldOption = { label: '1', value: 1 };

      component.selectedValue = 1;
      component.onModelChange = undefined;

      spyOn(component, 'getOptionFromValue').and.returnValue(oldOption);
      spyOn(component, 'updateSelectedValue');

      component['updateSelectedValueWithOldOption']();

      expect(component.getOptionFromValue).toHaveBeenCalled();
      expect(component.updateSelectedValue).toHaveBeenCalledWith(oldOption);
    });

    it(`updateSelectedValueWithOldOption: should call 'updateSelectedValue' passing oldOption found and 'false' when
      'onModelChange' is defined`, () => {
      const oldOption = { label: '1', value: 1 };

      component.selectedValue = 1;
      component.onModelChange = () => {};

      spyOn(component, 'getOptionFromValue').and.returnValue(oldOption);
      spyOn(component, 'updateSelectedValue');

      component['updateSelectedValueWithOldOption']();

      expect(component.getOptionFromValue).toHaveBeenCalled();
      expect(component.updateSelectedValue).toHaveBeenCalledWith(oldOption);
    });

    it('updateSelectedValueWithOldOption: shouldn`t call `updateSelectedValue` when not found oldOption', () => {
      component.selectedValue = 1;

      spyOn(component, 'getOptionFromValue').and.returnValue({});
      spyOn(component, 'updateSelectedValue');

      component['updateSelectedValueWithOldOption']();

      expect(component.getOptionFromValue).toHaveBeenCalled();
      expect(component.updateSelectedValue).not.toHaveBeenCalled();
    });

    it('verifyValidOption: should call `updateSelectedValue` with optionFound and set previousSearchValue with optionFound.label', () => {
      const optionFound = { value: 1, label: '1' };
      component.selectedValue = undefined;

      spyOn(component, 'getInputValue').and.returnValue('1');
      spyOn(component, 'getOptionFromLabel').and.returnValue(optionFound);
      spyOn(component, 'updateSelectedValue');

      component.verifyValidOption();

      expect(component.getInputValue).toHaveBeenCalled();
      expect(component.getOptionFromLabel).toHaveBeenCalled();
      expect(component.updateSelectedValue).toHaveBeenCalledWith(optionFound);
      expect(component.previousSearchValue).toEqual(optionFound.label);
    });

    it(`verifyValidOption: should call 'updateSelectedValueWithOldOption' and not call 'updateSelectedValue'
      and set 'previousSearchValue' with optionFound.label`, () => {
      component.selectedValue = 1;
      component.selectedOption = { value: 1, label: '1' };

      spyOn(component, 'getInputValue').and.returnValue('po');
      spyOn(component, 'getOptionFromLabel').and.returnValue(undefined);
      spyOn(component, 'updateSelectedValue');
      spyOn(component, <any> 'updateSelectedValueWithOldOption');

      component.verifyValidOption();

      expect(component.previousSearchValue).toEqual(component.selectedOption.label);
      expect(component['updateSelectedValueWithOldOption']).toHaveBeenCalled();
      expect(component.getInputValue).toHaveBeenCalled();
      expect(component.getOptionFromLabel).toHaveBeenCalled();
      expect(component.updateSelectedValue).not.toHaveBeenCalled();
    });

    it(`verifyValidOption: should call 'updateSelectedValue' with null and 'false' when inputValue is falsy and
      'selectedOption.label' equal 'inputValue' and set 'previousSearchValue' with ''`, () => {
      component.onModelChange = () => {};

      spyOn(component, 'getInputValue').and.returnValue('1');
      spyOn(component, 'getOptionFromLabel').and.returnValue(undefined);
      spyOn(component, 'updateSelectedValue');

      component.verifyValidOption();

      expect(component.getInputValue).toHaveBeenCalled();
      expect(component.getOptionFromLabel).toHaveBeenCalled();
      expect(component.updateSelectedValue).toHaveBeenCalledWith(null, false);
      expect(component.previousSearchValue).toEqual('');
    });

    it(`verifyValidOption: should call 'updateSelectedValue' with null and 'true' when inputValue is truthy`, () => {
      component.selectedOption = { value: 2, label: '2' };

      spyOn(component, 'getInputValue').and.returnValue('1');
      spyOn(component, 'getOptionFromLabel').and.returnValue(undefined);
      spyOn(component, 'updateSelectedValue');

      component.verifyValidOption();

      expect(component.getInputValue).toHaveBeenCalled();
      expect(component.getOptionFromLabel).toHaveBeenCalled();
      expect(component.updateSelectedValue).toHaveBeenCalledWith(null, true);
    });

    it('verifyValidOption: shouldn`t call `updateSelectedValue` when inputValue is falsy', () => {
      component.selectedOption = undefined;

      spyOn(component, 'getInputValue').and.returnValue('');
      spyOn(component, 'getOptionFromLabel').and.returnValue(undefined);
      spyOn(component, 'updateSelectedValue');

      component.verifyValidOption();

      expect(component.getInputValue).toHaveBeenCalled();
      expect(component.getOptionFromLabel).toHaveBeenCalled();
      expect(component.updateSelectedValue).not.toHaveBeenCalled();
    });

    it('registerOnValidatorChange: should register validatorChange function.', () => {
      const registerOnValidatorChangeFn = () => {};

      component.registerOnValidatorChange(registerOnValidatorChangeFn);
      expect(component['validatorChange']).toBe(registerOnValidatorChangeFn);
    });

    it('validate: should return required obj when `requiredFailed` is true.', () => {
      const validObj = {
        required: {
          valid: false,
        }
      };

      spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(true);

      expect(component.validate(new FormControl([]))).toEqual(validObj);
      expect(ValidatorsFunctions.requiredFailed).toHaveBeenCalled();
    });

    it('validate: should return undefined when `requiredFailed` is false', () => {
      spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(false);

      expect(component.validate(new FormControl(null))).toBeUndefined();
      expect(ValidatorsFunctions.requiredFailed).toHaveBeenCalled();
    });

    it('validateModel: should call `validatorChange` when `validateModel` is a function.', () => {
      component['validatorChange'] = () => {};

      spyOn(component, <any> 'validatorChange');

      component['validateModel']([]);

      expect(component['validatorChange']).toHaveBeenCalledWith([]);
    });

    it('validateModel: shouldn`t call `validatorChange` when `validateModel` is false.', () => {
      component['validatorChange'] = undefined;
      component['validateModel']([]);

      expect(component['validatorChange']).toBeUndefined();
    });

    it(`configAfterSetFilterService: should call the 'unsubscribeKeyupObservable' and 'onInitService' methods if
      filterService is defined.`, () => {

      const filterService = 'https://portinari.io/sample/api/new/heroes';

      spyOn(component, <any> 'unsubscribeKeyupObservable');
      spyOn(component, 'onInitService');

      component['configAfterSetFilterService'](filterService);

      expect(component['unsubscribeKeyupObservable']).toHaveBeenCalled();
      expect(component.onInitService).toHaveBeenCalled();

    });

    it(`configAfterSetFilterService: shouldn't contain objects in the 'option' if filterService is defined.`, () => {
      const filterService = 'https://portinari.io/sample/api/new/heroes';

      component['configAfterSetFilterService'](filterService);

      expect(component.options.length).toBe(0);
    });

    it('configAfterSetFilterService: should return `service` with undefined if filterService is undefined.', () => {
      const filterService = undefined;

      component['configAfterSetFilterService'](filterService);

      expect(component.service).toBeUndefined();
    });

    it('configAfterSetFilterService: should contain 1 object in the options if filterService is undefined.', () => {
      const filterService = undefined;
      component.cacheStaticOptions = [{ label: '1', value: '1'}];

      component['configAfterSetFilterService'](filterService);

      expect(component.options.length).toBe(1);
    });

    it('configAfterSetFilterService: shouldn`t contain objects in the `visibleOptions` if it doesn`t have `filterService`.', () => {
      const filterService = undefined;

      component['configAfterSetFilterService'](filterService);

      expect(component.visibleOptions.length).toBe(0);
    });

    it('configAfterSetFilterService: shouldn`t contain objects in the `visibleOptions` if it has `filterService.', () => {
      const filterService = 'https://portinari.io/sample/api/new/heroes';

      component['configAfterSetFilterService'](filterService);

      expect(component.visibleOptions.length).toBe(0);
    });

    it('configAfterSetFilterService: should set the `isFirstFilter` property as true if it doesn`t have `filterService`.', () => {
      const filterService = undefined;

      component['configAfterSetFilterService'](filterService);

      expect(component.isFirstFilter).toBeTruthy();
    });

    it('configAfterSetFilterService: should set the `isFirstFilter` property as true if it has `filterService`.', () => {
      const filterService = 'https://portinari.io/sample/api/new/heroes';

      component['configAfterSetFilterService'](filterService);

      expect(component.isFirstFilter).toBeTruthy();
    });

    it('updateSelectedValue: should call `setInputValue`, `updateInternalVariables` and `updateModel` with `changeOnEnter` false', () => {
      const option = { value: 'value', label: 'label' };

      component.changeOnEnter = false;

      const spySetInputValue = spyOn(component, 'setInputValue');
      const spyUpdateInternalVariables = spyOn(component, <any> 'updateInternalVariables');
      const spyUpdateModel = spyOn(component, <any> 'updateModel');

      component.updateSelectedValue(option);

      expect(spySetInputValue).toHaveBeenCalledWith(option.label);
      expect(spyUpdateInternalVariables).toHaveBeenCalledWith(option);
      expect(spyUpdateModel).toHaveBeenCalledWith(option.value, false);
    });

    it(`updateSelectedValue: should call 'setInputValue', 'updateInternalVariables' and 'updateModel' with
      'changeOnEnter' true and valid 'option'`, () => {
      const option = { value: 'value', label: 'label' };

      component.changeOnEnter = true;

      const spySetInputValue = spyOn(component, 'setInputValue');
      const spyUpdateInternalVariables = spyOn(component, <any> 'updateInternalVariables');
      const spyUpdateModel = spyOn(component, <any> 'updateModel');

      component.updateSelectedValue(option);

      expect(spySetInputValue).toHaveBeenCalledWith(option.label);
      expect(spyUpdateInternalVariables).toHaveBeenCalledWith(option);
      expect(spyUpdateModel).toHaveBeenCalledWith(option.value, false);
    });

    it(`updateSelectedValue: should call 'setInputValue', 'updateInternalVariables' and 'updateModel' with
    'changeOnEnter' true and null 'option'`, () => {
      const option = null;

      component.changeOnEnter = false;

      const spySetInputValue = spyOn(component, 'setInputValue');
      const spyUpdateInternalVariables = spyOn(component, <any> 'updateInternalVariables');
      const spyUpdateModel = spyOn(component, <any> 'updateModel');

      component.updateSelectedValue(option);

      expect(spySetInputValue).toHaveBeenCalledWith('');
      expect(spyUpdateInternalVariables).toHaveBeenCalledWith(option);
      expect(spyUpdateModel).toHaveBeenCalledWith(undefined, false);
    });

    it(`updateSelectedValue: shouldn't call 'setInputValue' and 'updateModel' if 'changeOnEnter' is true
      and isUpdateModel is false'`, () => {
      const option = { value: 'value', label: 'label' };

      component.changeOnEnter = true;

      const spySetInputValue = spyOn(component, 'setInputValue');
      const spyUpdateInternalVariables = spyOn(component, <any> 'updateInternalVariables');
      const spyUpdateModel = spyOn(component, <any> 'updateModel');

      component.updateSelectedValue(option, false);

      expect(spyUpdateInternalVariables).toHaveBeenCalledWith(option);

      expect(spySetInputValue).not.toHaveBeenCalled();
      expect(spyUpdateModel).not.toHaveBeenCalled();
    });

    it('updateSelectedValue: shouldn`t call `updateModel` if `isUpdateModel` is false', () => {
      const option = { value: 1, label: '1' };

      const spySetInputValue = spyOn(component, 'setInputValue');
      const spyUpdateInternalVariables = spyOn(component, <any> 'updateInternalVariables');
      const spyUpdateModel = spyOn(component, <any> 'updateModel');

      component.updateSelectedValue(option, false);

      expect(spySetInputValue).toHaveBeenCalledWith(option.label);
      expect(spyUpdateInternalVariables).toHaveBeenCalledWith(option);

      expect(spyUpdateModel).not.toHaveBeenCalled();
    });

    it('updateComboList: should set `visibleOptions` with `component.options` if `options param` and `selectedValue` are falsy', () => {
      component.options = [{ label: '1', value: '1' }];
      component.selectedValue = undefined;

      component.updateComboList();

      expect(component.visibleOptions).toEqual(component.options);
    });

    it('updateComboList: should set `visibleOptions` with `options param` if `options param` is true and `selectedValue` is falsy', () => {
      const options = [{ label: '1', value: '1' }];

      component.selectedValue = undefined;

      component.updateComboList(options);

      expect(component.visibleOptions).toEqual(options);
    });

    it(`updateComboList: should set 'visibleOptions' with 'selectedOption' if 'options param' is falsy
      and 'selectedValue' is truthy`, () => {
      const option = { label: '1', value: '1' };

      component.selectedOption = option;
      component.selectedView = option;

      component.selectedValue = '1';

      component.updateComboList();

      expect(component.visibleOptions).toEqual([option]);
    });

    it(`updateComboList: should set 'selectedView' with first position of visibleOptions if 'selectedView' was undefined`, () => {
      const options = [{ label: '1', value: '1' }, { label: '2', value: '2' }];

      component.options = options;
      component.selectedValue = undefined;
      component.selectedView = undefined;

      component.updateComboList();

      expect(component.visibleOptions).toEqual(options);
      expect(component.selectedView).toEqual(options[0]);
    });

    it('updateInternalVariables: should set `selectedView` and `selectedOption` with option param if it is truthy', () => {
      const option = { label: 'Label 01', value: 1 };

      component['updateInternalVariables'](option);

      expect(component.selectedOption).toEqual(option);
      expect(component.selectedView).toEqual(option);
    });

    it('updateInternalVariables: should set `selectedView` and `selectedOption` with undefined if it is null', () => {
      component['updateInternalVariables'](null);

      expect(component.selectedOption).toEqual(undefined);
      expect(component.selectedView).toEqual(undefined);
    });

  });

});

describe('PoComboBaseComponent using Service', () => {
  let component: PoComboTest;

  const defaultService: any = {
    url: '',
    fieldLabel: 'label',
    fieldValue: 'value',
    getFilteredData: (params: any) => new Observable(),
    getObjectByValue: (value: string | number) => new Observable(),
    configProperties: (url: string, label: string, value: string) => {}
  };

  const service: PoComboFilter = {
    getFilteredData: (params: any) => new Observable(),
    getObjectByValue: (value: string | number) => new Observable()
  };

  beforeEach(() => {
    component = new PoComboTest();

    component.filterService = service;
    component.defaultService = defaultService;
  });

  it('should update property `p-field-label` with valid values and update `fieldLabel` property of service', () => {
    component.filterService = 'http://exemple.com';
    const validValues = ['name'];

    expectPropertiesValues(component, 'fieldLabel', validValues, validValues);
    expect(component.service.fieldLabel).toEqual('name');
  });

  it('should update property `p-field-label` with default value when invalid value and update `fieldLabel` property of service', () => {
    component.filterService = 'http://exemple.com';
    const validValues = [undefined];
    const defaultValue = 'label';

    expectPropertiesValues(component, 'fieldLabel', validValues, defaultValue);
    expect(component.service.fieldLabel).toEqual(defaultValue);
  });

  it('shouldn`t update property `fieldLabel` in service when it is custom service or not exists', () => {
    component.filterService = service;
    component.fieldLabel = 'nickname';

    expect(component.service.fieldLabel).toBeUndefined();
  });

  it('should update property `p-field-value` with valid values and update `fieldValue` property of service', () => {
    component.filterService = 'http://exemple.com';
    const validValues = ['name'];

    expectPropertiesValues(component, 'fieldValue', validValues, validValues);
    expect(component.service.fieldValue).toEqual('name');
  });

  it('should update property `p-field-value` with default value when invalid value and update `fieldValue` property of service', () => {
    component.filterService = 'http://exemple.com';
    const validValues = [undefined];
    const defaultValue = 'value';

    expectPropertiesValues(component, 'fieldValue', validValues, defaultValue);
    expect(component.service.fieldValue).toEqual(defaultValue);
  });

  it('shouldn`t update property `fieldValue` in service when it is custom service or not exists', () => {
    component.filterService = service;
    component.fieldValue = 'nickname';

    expect(component.service.fieldValue).toBeUndefined();
  });

  it('should set property `p-filter-service`', () => {
    spyOn(component, <any> 'configAfterSetFilterService');

    component.filterService = service;

    expect(component['configAfterSetFilterService']).toHaveBeenCalled();
  });

  it('should call the `updateComboList` if the` ngOnInit` is called.', () => {
    spyOn(component, 'updateComboList');

    component.ngOnInit();

    expect(component.updateComboList).toHaveBeenCalled();
  });

  it('should update property `p-debounce-time` with `400` when invalid values', () => {
    const invalidValues = [undefined, null, '', 0, true, false, 'string', [], {}, -50];

    spyOn(component, <any> 'unsubscribeKeyupObservable');
    spyOn(component, <any> 'initInputObservable');

    expectPropertiesValues(component, 'debounceTime', invalidValues, 400);

    expect(component['unsubscribeKeyupObservable']).toHaveBeenCalled();
    expect(component['initInputObservable']).toHaveBeenCalled();
  });

  it('should update property `p-debounce-time` with valid values', () => {
    const validValues = [400, 100, 1000];

    spyOn(component, <any> 'unsubscribeKeyupObservable');
    spyOn(component, <any> 'initInputObservable');

    expectPropertiesValues(component, 'debounceTime', validValues, validValues);

    expect(component['unsubscribeKeyupObservable']).toHaveBeenCalled();
    expect(component['initInputObservable']).toHaveBeenCalled();
  });

  it('should not set service', () => {
    component.service = undefined;
    component.setService(null);

    expect(component.service).toBeUndefined();
  });

  it('should set service with a class that implements PoComboDataServer', () => {
    component.setService(service);

    expect(component.service.getFilteredData).toBeTruthy();
    expect(component.service.getObjectByValue).toBeTruthy();
  });

  it('should set service with URL Service and others configurations', () => {
    const urlService = 'https://portinari.io/sample/api/new/heros';

    component.setService(urlService);

    expect(component.service.configProperties).toBeTruthy();
    expect(component.service.getFilteredData).toBeTruthy();
    expect(component.service.getObjectByValue).toBeTruthy();
  });

  it('should init service', () => {
    spyOn(component, 'setService');
    spyOn(component, 'initInputObservable');

    component.onInitService();

    expect(component.setService).toHaveBeenCalled();
    expect(component.initInputObservable).toHaveBeenCalled();
  });

  it('should not init service', () => {
    spyOn(component, 'setService');
    spyOn(component, 'initInputObservable');

    component.filterService = undefined;
    component.onInitService();

    expect(component.setService).not.toHaveBeenCalled();
    expect(component.initInputObservable).not.toHaveBeenCalled();
  });

  it('should call getObjectByValue through writeValue', () => {
    spyOn(component, 'getObjectByValue');

    component.writeValue('angular');

    expect(component.getObjectByValue).toHaveBeenCalled();
  });
});

function getFakeService(item): any {
  return new Observable(obs => {
    obs.next(item);
    obs.complete();
  });
}