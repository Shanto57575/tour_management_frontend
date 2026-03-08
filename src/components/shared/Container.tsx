import type { ReactNode } from "react";

interface ContainerProps {
    children: ReactNode;
    className?: string;
    innerClassName?: string;
    id?: string;
}

export const Container = ({ children, className = "", innerClassName = "", id }: ContainerProps) => {
    return (
        <section id={id} className={`w-full ${className}`}>
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${innerClassName}`}>
                {children}
            </div>
        </section>
    );
};
