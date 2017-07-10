import { createElement } from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import cx from 'classnames';
import rules from './../rules';
import Base from './../components/Base/Base';

export default function textareaFactory(WrappedComponent) {
    class CustomTextarea extends Base {
        static contextTypes = {
            register: PropTypes.func.isRequired,
            unregister: PropTypes.func.isRequired,
            validateState: PropTypes.func.isRequired,
            components: PropTypes.objectOf(PropTypes.any),
            errors: PropTypes.objectOf(PropTypes.array)
        };

        constructor(props, context) {
            super(props, context);

            this.state = {
                value: props.value,
                isChanged: !!props.value,
                isUsed: false,
                isChecked: true
            };

            context.register(this);
        }

        render() {
            const {
                /* eslint-disable */
                validations,
                /* eslint-enable */
                errorClassName,
                containerClassName,
                errorContainerClassName,
                className,
                /* eslint-disable */
                value,
                onChange,
                onBlur,
                /* eslint-enable */
                ...rest } = this.props;
            // TODO: Refactor conditions
            const isInvalid = this.state.isUsed &&
                this.state.isChanged &&
                !!this.context.errors[this.props.name];
            const error = isInvalid && this.context.errors[this.props.name][0];
            let hint = null;

            if (isInvalid) {
                hint = typeof error === 'function'
                  ? error(this.state.value, this.context.components)
                  : rules[error].hint(this.state.value, this.context.components);
            }

            const wrappedProps = {
                containerClassName: cx({
                    [containerClassName]: !!containerClassName,
                    [errorContainerClassName]: !!error && errorContainerClassName
                }),
                className: cx({
                    [className]: !!className,
                    [errorClassName]: !!error && errorClassName
                }),
                onChange: this.onChange,
                onBlur: this.onBlur,
                hint,
                ...rest
            };

            if (this.onChange) {
                wrappedProps.value = this.state.value;
            }

            return createElement(WrappedComponent, wrappedProps);
        }
    }

    return hoistStatics(CustomTextarea, WrappedComponent);
}
